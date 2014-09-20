define('haku.loader', ['jquery','underscore', 'yarn', 'ejs', 'haku.fileSystemShim'], function($,_, yarn){

    "use strict";

    var Loader = function(options){

        var defaults = {
            onLoaded : null,    // callback when all items have been process
            onStatusUpdate : null, // callback with status update message
            onItemDownloaded : null   // callback when an item has been downloaded. Return obj
        };

        defaults = $.extend(defaults, options);
        $.extend(this, defaults)

        this._filesChecked = 0;
        this._filesDownloaded = 0;
        this._root;
        this._itemsNeedingUpdates = [];
        this._totalItemsNeedingUpdating = 0;
        this._itemsToDelete = [];
        this._fs;
        this._localStamp;
        this._lastLogMessage;
        this._stamp;
        this._fileKey;
        this._fileTransfer = null;
        this._progressCurrent = 0;
        this._manifest;
        this._filereader;
        this._existingFiles;
        this._fullManifestStamp;
        this._settings = {};

        // Default settings, must be production-ready. Settings can be overwritten by config file,
        // but assume this is on a dev or advanced user system.

        this._settings.enabled = false;
        this._settings.enableLogging = false;
        this._settings.verboseLogging = false;
        this._settings.forceFullFetch = false;
        this._settings.pauseBetweenFiles = 0;
        this._settings.maxLogItems = 10;
        this._settings.onLoaded = null; // callback. Not the same as loader's own onloaded.
        this._settings.appName = "APP-NAME-NOT-SET",
        this._settings.appTitle = "APP TITLE NOT SET",
        this._settings.url = "MANIFEST URL NOT SET";  // url of remote manifest
        this._settings.assetsMode = "files"; 										// compiled|files
        this._settings.StorageRoot = "file:///mnt/sdcard/" + this._settings.appName + "/www/"; 			// Location on local storage where content is stored. Used "files" mode. Must end with "/".
        this._settings.LoaderSettings = "file:///mnt/sdcard/" + this._settings.appName + "/loader-manifest.xml"; 	// location on local storage of loader settings file. Used "files" mode, and only as developer override.
        this._settings.CompiledRoot = "file:///android_asset/www/core/"; 			// Location of in-app resources. Used in "compiled" mode. Must end with "/".


        _.extend(this._settings, haku.settings.loader);
        this.loadFileSystem();
    };


    /**
    *
    */
    Loader.prototype = function () { this.apply(this, arguments); }


    /**
     *
     */
    Loader.prototype.loadFileSystem = function() {
        var self = this;
        this.log('Attempting to load filesystem.');

        if (this._settings.assetsMode === "compiled")
            this._root = this._settings.CompiledRoot;
        else
            this._root = this._settings.StorageRoot;

        window.requestFileSystem(
        	LocalFileSystem.PERSISTENT,
            0,
	        function (fs) {

                // store reference to file system for additional calls
                self._fs = fs;

                // find or create app root storage folder, and then start process to check/fill it
	            self.directoryExists(
                    self._root,
                    function (exists) {
                        if (exists) {
                            self.findExistingFiles();
                        } else {
                            self.createDirectory(self._root, function () {
                                self.findExistingFiles();
                            });
                        }
                    }
                );
            },
            function (err) {
                self.log('failed to load filesystem ' + err);
            }
        );
    }


    /**
     *
     */
    Loader.prototype.findExistingFiles = function () {
        var self = this;
        self.listFiles(self._root, function (files) {
            self._existingFiles = files;
            self.determineUpdates();
        });
    }

    /**
     *  Gets a list of all files in a given folder, regardless of nesting depth.
     *  callback : invoked with array of files.
     */
    Loader.prototype.listFiles = function (directory, onDone) {

        var self = this,
            filesFound = [],
            directoriesToScan = [],
            directoriesScanned = 0;

        directoriesToScan.push(directory);

        function processNext() {
            directoriesScanned++;

            var dir = directoriesToScan[directoriesToScan.length - 1];
            directoriesToScan.pop();

            // Get a directory reader
            var dirEntry = new DirectoryEntry("huh", dir);
            var directoryReader = dirEntry.createReader();

            self.log("Attempting to read contents of folder " + dir);

            // Get a list of all the entries in the directory
            directoryReader.readEntries(onFilesRead, fail);
        }

        function onFilesRead(entries) {
            for (var i = 0, entry = entries[i]; i < entries.length; i++) {

                if (entry.isFile) {
                    filesFound.push(entry.fullPath);
                } else if (entry.isDirectory) {
                    directoriesToScan.push(entry.fullPath);
                }
            }


            if (directoriesToScan.length === 0) {
                // all directories scanned. proceed to next phase
                self.log(directoriesScanned + ' directories scanned, ' + filesFound.length + ' files found');
                onDone(filesFound);
            } else {
                processNext();
            }
        }

        function fail(error) {
            self.log("Failed to list directory contents : " + error.code);
        }

        processNext();
    };


    /**
     * works out what needs to be updated
     */
    Loader.prototype.determineUpdates = function (appFolderExists) {
        var self = this;
        this.log('Filesystem ready.');

        if (!self._settings.enabled) {
            self.log('Live content updating disabled.');
            self.exit();
            return;
        }

        self.log("Attempting to fetch manifest at " + self._settings.url);

        $.ajax({
            url: self._settings.url,
            cache: false,
            dataType: 'json',
            error: function (request, status, exception) {

                self.log("Error getting manifest list. " + request + "," + status + "," + exception + ".");
                if (request.status === 0) {
                    var msg = 'Can\'t contact server at ' + self._settings.url + '. Stopping.';
                    self.log(msg);
                }

            }, success: function (manifest) {

                processManifest(manifest);

            }
        });

        function processManifest(manifest){
            self._manifest = manifest;
            self._fullManifestStamp = manifest.stamp;
            var fullLocalManifestStamp = window.localStorage.getItem("localmanifeststamp");


            // content is up to date if local manifest stamp is the same as remote stamp,
            // the same number of files are present (we assume user can delete local files but we don't check specific files with hashes etc)
            // and we aren't forcing an update
            if (self._fullManifestStamp === fullLocalManifestStamp
                && self._existingFiles.length === manifest.files.length
                && !self._settings.forceFullFetch)
            {
                self.log("All local content is already up to date - downloading bypassed.");
                self.exit();
                return;
            }

            // check each item in manifest against its local item, to see if item is present or out of date.
            // out of date = the remote hash differs from the local hash.
            // local hash is stored in localStorage, and is a unique fragment of the item path
            $.each(manifest.files, function (i, item) {
                var localPathFragment = item.remote.replace(manifest.remoteRootStub, ''),
                    key = localPathFragment + '_key',
                    localPath = yarn.urlCombine(self._root, localPathFragment),
                    localItemHash = window.localStorage.getItem(key);

                // remove current from array of existing local files
                for (var i = 0 ; i < self._existingFiles.length; i ++){
                    if (self._existingFiles[i] === localPath){
                        self._existingFiles.splice(i, 1);
                        break;
                    }
                }

                self.log('localManifestStamp: ' + localItemHash + ' .remoteManifestStamp: ' + item.stamp);

                self.ifFileExists(localPath, function (exists) {

                    var upToDate = exists && localItemHash && localItemHash === item.stamp;

                    if (!upToDate) {
                        self.log("File " +  localPathFragment +" is not up to date ");

                        self._itemsNeedingUpdates.push({
                            localRelative: localPathFragment,
                            remotePath: self._settings.url,
                            localSavePath: localPath,
                            key: key,
                            hash: item.stamp
                        });
                    } else {
                        self.log("File " + localPathFragment + " is up to date ");
                    }

                    // if all files in manifest are checked proceed to download required content
                    if (i >= self._manifest.files.length - 1) {

                        // must set total here, the download method recurses
                        self._totalItemsNeedingUpdating = self._itemsNeedingUpdates.length;

                        self.downloadNextRequiredUpdate();
                    }
                });

            }); // each loop
        }
    }


    /**
     * Recursing method that marshals downloads of all items in update queue. Once all items are done, proceeds to delete orphans.
     */
    Loader.prototype.downloadNextRequiredUpdate = function () {


        if (this._itemsNeedingUpdates.length == 0) {
            window.localStorage.setItem("localmanifeststamp", this._fullManifestStamp);
            this.log("Finished updating. " + this._filesChecked + " files checked, " + this._filesDownloaded + " files downloaded. ");
            this.deleteOrphanFiles();
            return;
        }

        var self = this,
            item = this._itemsNeedingUpdates[this._itemsNeedingUpdates.length - 1];
        this._itemsNeedingUpdates.pop();

        this.log("Fetching latest version of " + item.localRelative + " from " + item.remotePath)


        // determine the directory the item will be placed in. This must be created if necessary
        var itemDirectory = yarn.urlCombine(this._root, item.localRelative);
        itemDirectory = yarn.returnUptoLast(itemDirectory, "/") + "/";

        this.createDirectory(itemDirectory, function () {
            var file = yarn.returnAfterLast(item.remotePath, "/");

            self.downloadFileTo(file, item.remotePath, item.localSavePath, function () {
                window.localStorage.setItem(item.key, item.hash);
                self._filesDownloaded++;

                if (self.onProgress){
                    self.onProgress({ itemIndex : self._filesDownloaded });
                }

                // call self to do next file.
                self.downloadNextRequiredUpdate();
            });
        });
    }


    /**
     *
     */
    Loader.prototype.deleteOrphanFiles = function () {

        // doesn't work yet, bypass
        this.exit();
        var self = this;
        return;

        function sucess(entry) {
            self.log('Successfully delete file ' + entry);
            processNext();
        }

        function fail(error) {
            self.log('Error deleting file ' + error);
        }

        function processNext() {

            if (_existingFiles.length === 0) {
                self.exit();
                return;
            }

            var filename = _existingFiles[_existingFiles.length - 1];
            _existingFiles.pop();

            self.log('Attempting to delete ' + filename);
            self._fs.root.getFile(
		        filename, // must be just a filename, will be put in default path
    		    null,
		        function (fileEntry) {

		            fileEntry.remove(
                        sucess,
                        fail);

		        }
            ) // getfile

        }

        this.processNext();
    }


    /**
     * wraps up and loads first page
     */
    Loader.prototype.exit = function () {
        if (this.onLoaded)
            this.onLoaded();
    }


    /**
     * checks if the directory exists
     */
    Loader.prototype.directoryExists = function (path, callback) {
        this.log('Checking if directory ' + path + ' exists');

        // path must start with a single "/"
        path = path.replace("file://", ""); // todo : fix ; this is android specific!
        this._fs.root.getDirectory(
	    	path,
	    	{ create: false, exclusive: false },
	        function () {
	            callback(true);
	        },
	        function (err) {
	            callback(false);
	        }
        );
    }


    /**
     * checks if file exists. Invokes callback with boolean result.
     */
    Loader.prototype.ifFileExists = function (path, callback) {

        this.log('Checking if file ' + path + ' exists');

        if (this._filereader == null) {
            this._filereader = new FileReader();
        }

        this._filereader.onloadend = function (e) {

            if (e.target.result) {
                callback(true);
            } else {
                callback(false);
            }
        };

        this._filereader.readAsDataURL(path);
    }


    /**
     *  Creates a directory for a complex path. Path is broken up into component directories, and each one created in turn.
     */
    Loader.prototype.createDirectory = function (path, callback) {

        if (yarn.endsWith(path, "/"))
            path = path.substring(0, path.length - 1);

        path = path.replace("file:///", ""); // todo : fix ; this is android specific!

        var self = this,
            dirs = path.split("/"),
            sofar = "";

        function work(i) {
            if (i >= dirs.length) {

                // done
                if (callback !== null) {
                    callback();
                }

            } else {

                sofar = sofar + "/" + dirs[i];

                self._fs.root.getDirectory(
			    	sofar,
			    	{ create: true, exclusive: false },
			        function () {
			            work(i + 1);
			        },
			        function () {
                        self.log('Directory create failed for ' + sofar);
			        }
		        );
            }
        }

        work(0);
    }


    /**
    *
    */
    Loader.prototype.log = function (message) {

        // prevent relog flooding
        if (this._lastLogMessage === message)
            return;

        this._lastLogMessage = message;

        if (this._settings.enableLogging) {
            console.log(message);
            var item = $('<li>' + message + '</li>');
            var host = $('#phLog');
            host.prepend(item);

            if (host.children().length > this._settings.maxLogItems) {
                host.children().last().remove();
            }
        }
    }


    /**
     * Downloads a file and saves it to a local path
     * @param {string} filename - name of just the file. Needed by Phonegap to create a file pointer.
     * @param {string} remotePath - url to get file from. Url MUST be whitelisted, else code3 error occurs.
     * @param {string} localPath - Full path on file system to save to. Must already exist.
     * @param {string} callback - Delegate when downloading is complete.
     * @param {bool} ignoreErrors - If true, callback will be invoked on error.
     */
    Loader.prototype.downloadFileTo = function (filename, remotePath, localPath, callback, ignoreErrors) {
        this.log('attempting to download file ' + filename +' , from ' + remotePath +', to ' + localPath);

        var self = this,
            fail = function (err) {
                self.log('failed to get filesystem : ' + err);
            };

        this._fs.root.getFile(
		    filename, // must be just a filename, will be put in default path
    		{create: true, exclusive: false },
		    function (fileEntry) {

		        var sPath = fileEntry.fullPath.replace(filename, '');
		        sPath = sPath + localPath; // this is where actual save path is made
		        // path looks like "file:///mnt/sdcard/"
		        // remove existing
		        fileEntry.remove();

		        // reuse filetransfer, it seems recreating the a transfer object can "stress"
		        // the device.
		        if (self._fileTransfer === null) {
                    self._fileTransfer = new FileTransfer();
		        }

                self._fileTransfer.download(
    			    remotePath,
    			    localPath,
				    function () {

                        self.log("Finished downloading file "+ remotePath);

				        if (callback != null) {
				            callback();
				        }
				    },
    		        function (error) {

                        self.log("download failed, remote : " + remotePath + ", local " + localPath + ", err src : " + error.source + ", target " + error.target + ", code " + error.code);
    		            if (ignoreErrors && callback)
    		                callback();
    		        }
                );
		    }
        ) // getfile
    }


    return Loader;

});
