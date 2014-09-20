(function(){

    "use strict";

    window.LocalFileSystem = {
        PERSISTENT  : "PERSISTENT"
    };

    // Note that phonegap's filesystem is not attached to window as a global.
    // For shimming purposes however it is appended there to make it easier to retrieve.
    window.filesystem = {
        shim : {
            failOnGetFile : false,
            failOnRemoveFile : false,
            failOnGetDirectory : false,
            failOnFileExistsCheck : true,
            // shim. returned DirectoryReader.readEntries
            files : []
        },

        root : {
            getFile : function(fileName, someVar, success, fail) {
                if (filesystem.shim.failOnGetFile)
                    fail();
                else
                    success(new File(fileName));
            },
            getDirectory : function(path, args, success, fail){
                if (filesystem.shim.failOnGetDirectory && fail)
                    fail();
                else if(success)
                    success();
            }
        }
    };


    /**
     *
     */
    var File = function(name){
        this.name = name;
        this.fullPath = name;
    };

    File.prototype.remove = function(success, fail){

        // remove file from "file system"
        for (var i = 0 ; i < filesystem.shim.files ; i ++){
            if (filesystem.shim.files[i] === this.name){
                filesystem.shim.files.splice(i, 1);
                break;
            }
        }

        if (filesystem.shim.failOnRemoveFile && fail)
            fail();
        else if (success)
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
        this.onloadend = null; // this must be invoked on read.
    };
    window.FileReader.prototype.readAsDataURL = function(path){
        if (this.onloadend){
            this.onloadend({
                target : {
                    result : !filesystem.shim.failOnFileExistsCheck
                }
            });
        }
    };


})();