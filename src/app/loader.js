/**
 *  Haku : a mobile and web build framework based on Phonegap and Backbone.
 *  @author  Shukri Adams (shukri.adams@gmail.com)
 *
 *  WARNING : This file is managed by Haku's own build scripts, and may be overwritten as part of the normal build process.
 *  Do not change its contents unless you know what you're doing.
 */

define('haku.loader', ['jquery','underscore', 'yarn', 'ejs', 'haku.fileSystemShim'], function($,_, yarn){

    "use strict";

    var Loader = function(options){

        var defaults = {
            _onLoaded : null,    // callback when all items have been process. do not override this
            onStatusUpdate : null, // callback with status update message
            onItemDownloaded : null,   // callback when an item has been downloaded. Return obj
            enabled : false,
            enableLogging : false,
            verboseLogging : false,
            forceFullFetch : false,
            pauseBetweenFiles : 0,
            maxLogItems : 10,
            onLoaded : null,// callback. Not the same as loader's own onloaded. and not invoked from this class. This is for reference only.
            appName : "APP-NAME-NOT-SET",
            appTitle : "APP TITLE NOT SET",
            onDownload : null, // invoked each time a file is downloaded.
            url : "MANIFEST URL NOT SET",  // url of remote manifest
            assetsMode : "files"
    };

        _.extend(defaults,options);
        _.extend(this,defaults);

        this._filesChecked = 0;
        this._filesDownloaded = 0;

        // a list of files which have already been downloaded to app
        this._existingFiles = [];

        // files requiring updates
        this._updateQueue = [];

        // total number of files requiring updating. Use for progress indication
        this._updateQueueTotal = 0;

        // application root storage folder. Varies across platform, and also varies between app using precompiled or adhoc content.
        this._rootDirectory = null;
        this._lastLogMessage = null;

        // phonegap file system object
        this._fs = null;

        // phonegap filetransfer object
        this._fileTransfer = null;

        // phonegap filereader object
        this._filereader = null;

        // hash of entire remote manifest. Set when manifest is downloaded
        this._manifestHash = null;

        // todo : fix android-specific paths
        if (this.assetsMode === "compiled"){
            // Location of in-app resources. Used in "compiled" mode. Must end with "/".
            this._rootDirectory = "file:///android_asset/www/core/";
        }
        else{
            // Location on local storage where content is stored. Used "files" mode. Must end with "/".
            this._rootDirectory = "file:///mnt/sdcard/" + this.appName + "/www/";
        }

        // start loader
        this.loadFileSystem();
    };


    /**
    *
    */
    Loader.prototype = function () { this.apply(this, arguments); };


    /**
     * Loads a static filesystem object and stores it as a class member.
     */
    Loader.prototype.loadFileSystem = function() {
        var self = this;
        this.log('Attempting to load filesystem.');

        window.requestFileSystem(
        	LocalFileSystem.PERSISTENT,
            0,
	        function (fs) {

                // store reference to file system for additional calls
                self._fs = fs;

                // find or create app root storage folder, and then start process to check/fill it
	            self.directoryExists(
                    self._rootDirectory,
                    function (exists) {
                        if (exists) {
                            self.findExistingFiles();
                        } else {
                            self.createDirectory(self._rootDirectory, function () {
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
    };


    /**
     * Trigges building of app file list, then triggers updating of those files,
     */
    Loader.prototype.findExistingFiles = function () {
        var self = this;
        self.listFiles(self._rootDirectory, function (files) {
            self._existingFiles = files;
            self.determineUpdates();
        });
    };


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

            var dir = directoriesToScan[directoriesToScan.length - 1],
                dirEntry = new DirectoryEntry("blank", dir),
                directoryReader = dirEntry.createReader();

            directoriesToScan.pop();

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
     * Works out which files need to be updated by downloading a remote manifest, then comparing the a hash for each remote file
     * to a corresponding hash in localStorage for that file. Files to updated are stored in an update queue.
     */
    Loader.prototype.determineUpdates = function () {
        var self = this;
        this.log('Filesystem ready.');

        if (!self.enabled) {
            self.log('Live content updating disabled.');
            self.exit();
            return;
        }

        self.log("Attempting to fetch manifest at " + self.url);

        $.ajax({
            url: self.url,
            cache: false,
            dataType: 'json',
            error: function (request, status, exception) {

                self.log("Error getting manifest list. " + request + "," + status + "," + exception + ".");
                if (request.status === 0) {
                    var msg = 'Can\'t contact server at ' + self.url + '. Stopping.';
                    self.log(msg);
                }

            }, success: function (manifest) {

                processManifest(manifest);

            }
        });

        function processManifest(manifest){
            self._manifestHash = manifest.hash;

            // content is up to date if local manifest hash is the same as remote hash,
            // the same number of files are present (we assume user can delete local files but we don't check specific files with hashes etc)
            // and we aren't forcing an update
            if (manifest.hash === localStorage.getItem("loader.manifestHash")
                && self._existingFiles.length === manifest.files.length
                && !self.forceFullFetch)
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
                    localPath = yarn.urlCombine(self._rootDirectory, localPathFragment),
                    localItemHash = localStorage.getItem(key);

                // remove current from array of existing local files
                for (var i = 0 ; i < self._existingFiles.length; i ++){
                    if (self._existingFiles[i] === localPath){
                        self._existingFiles.splice(i, 1);
                        break;
                    }
                }

                self.log('localManifesthashp: ' + localItemHash + ' .remoteManifesthash: ' + item.hash);

                self.ifFileExists(localPath, function (exists) {

                    var upToDate = exists && localItemHash && localItemHash === item.hash;

                    if (!upToDate) {
                        self.log("File " +  localPathFragment +" is not up to date ");

                        self._updateQueue.push({
                            localRelative: localPathFragment,
                            remotePath: self.url,
                            localSavePath: localPath,
                            key: key,
                            hash: item.hash
                        });
                    } else {
                        self.log("File " + localPathFragment + " is up to date ");
                    }

                    // if all files in manifest are checked proceed to download required content
                    if (i >= manifest.files.length - 1) {

                        // must set total here, the download method recurses
                        self._updateQueueTotal = self._updateQueue.length;

                        self.downloadNextRequiredUpdate();
                    }
                });

            }); // each loop
        }
    };


    /**
     * Recursing method that marshals downloads of all items in update queue. Once all items are done, proceeds to delete orphans.
     */
    Loader.prototype.downloadNextRequiredUpdate = function () {

        if (this._updateQueue.length == 0) {
            localStorage.setItem("loader.manifestHash", this._manifestHash);
            this.log("Finished updating. " + this._filesChecked + " files checked, " + this._filesDownloaded + " files downloaded. ");
            this.deleteOrphanFiles();
            return;
        }

        var self = this,
            item = this._updateQueue[this._updateQueue.length - 1];
        this._updateQueue.pop();

        this.log("Fetching latest version of " + item.localRelative + " from " + item.remotePath);


        // determine the directory the item will be placed in. This must be created if necessary
        var itemDirectory = yarn.urlCombine(this._rootDirectory, item.localRelative);
        itemDirectory = yarn.returnUptoLast(itemDirectory, "/") + "/";

        this.createDirectory(itemDirectory, function () {
            var file = yarn.returnAfterLast(item.remotePath, "/");

            self.downloadFileTo(file, item.remotePath, item.localSavePath, function () {
                localStorage.setItem(item.key, item.hash);
                self._filesDownloaded++;

                if (self.onDownload){
                    self.onDownload({ index : self._filesDownloaded, total : self._updateQueueTotal });
                }

                // call self to do next file.
                self.downloadNextRequiredUpdate();
            });
        });
    };


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
            ); // getfile

        }

        this.processNext();
    };


    /**
     * wraps up and loads first page
     */
    Loader.prototype.exit = function () {
        if (this._onLoaded)
            this._onLoaded();
    };


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
    };


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
    };


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
    };


    /**
    *
    */
    Loader.prototype.log = function (message) {

        // prevent relog flooding
        if (this._lastLogMessage === message)
            return;

        this._lastLogMessage = message;

        if (this.enableLogging) {
            console.log(message);
            var item = $('<li>' + message + '</li>');
            var host = $('#phLog');
            host.prepend(item);

            if (host.children().length > this.maxLogItems) {
                host.children().last().remove();
            }
        }
    };


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
        ); // getfile
    };


    return Loader;

});
