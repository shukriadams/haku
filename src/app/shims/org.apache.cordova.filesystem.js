(function(){

    "use strict";

    window.LocalFileSystem = {
        PERSISTENT  : "PERSISTENT"
    };

    var filesystem = {
        shim : {
            failOnGetFile : false,
            failOnRemoveFile : false,
            failOnGetDirectory : false,
            // shim. returned DirectoryReader.readEntries
            files : []
        },

        root : {
            getFile : function(fileName, someVar, success, fail) {
                if (filesystem.failOnGetFile)
                    fail();
                else
                    success(new File(name));
            },
            getDirectory : function(path, args, success, fail){
                if (filesystem.failOnGetDirectory)
                    fail();
                else
                    success();
            }
        }
    };


    /**
     *
     */
    var File = function(name){
        this.name = name;
    };

    File.prototype.remove = function(success, fail){

        // remove file from "file system"
        for (var i = 0 ; i < filesystem.shim.files ; i ++){
            if (filesystem.shim.files[i] === this.name){
                filesystem.shim.files.splice(i, 1);
                break;
            }
        }

        if (filesystem.failOnRemoveFile)
            fail();
        else
            success();
    };

    window.requestFileSystem = function(peristMode, unknownVariable, callback){
        callback(filesystem);
    }


    /**
     *
     */
    window.DirectoryEntry = function(name, dir){

    };
    window.DirectoryEntry.prototype.createReader = function(){
        return new DirectoryReader();
    };


    /**
     *
     */
    window.DirectoryReader = function(){

    };
    window.DirectoryReader.prototype.readEntries = function(success, fail){
        if (success)
            success(filesystem.shim.files);
    };


    /**
     * Mimics file downloader.
     */
    window.FileTransfer = function(){

    };
    window.FileTransfer.prototype.download = function(remotePath, writePath, success, failure){

        // "save" file
        filesystem.shim.files.push(writePath);

        if (success){
            success( writePath );
        }

    };


    /**
     *
     */
    window.FileReader = function(){

    };
    window.FileReader.prototype.readAsDataURL = function(path){

    };
    // event triggered when readAsDataURL is finished reading
    window.FileReader.prototype.onloadend = function(callback){
        if (callback){
            callback({
                target : {
                    result : true
                }
            });
        }
    };

})();