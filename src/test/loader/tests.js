require(['yarn'], function(yarn){

    "use strict";

    module("Haku loader tests", {
        setup: function () {

        },

        teardown: function () {

        }
    });

    asyncTest("tests that 1 file has been downloaded to filesystem", function () {
        // enable loader
        haku.settings.loader = {
            "appName" : "myApp",
            "appTitle" : "My App",
            "enabled" : true,
            "enableLogging" : true,
            "verboseLogging" : true,
            "url" : "/test/loader/loader-manifest-1file.json",
            "assetsMode" : "files",
            "forceFullFetch" : true,
            onLoaded : function(){
                start();
                ok(filesystem.shim.files.length === 1);
                ok(yarn.endsWith(filesystem.shim.files[0], "/1-file-test.html"))
            }
        }

        // restart haku
        haku.start();

    });

    asyncTest("tests that progress callback is invoked on file downloaded", function () {
        // enable loader
        haku.settings.loader = {
            "appName" : "myApp",
            "appTitle" : "My App",
            "enabled" : true,
            "enableLogging" : true,
            "verboseLogging" : true,
            "url" : "/test/loader/loader-manifest-1file.json",
            "assetsMode" : "files",
            "forceFullFetch" : true,
            onDownload : function(args){
                start();
                ok(args.index === 1);
                ok(args.total === 1);
            }
        }

        // restart haku
        haku.start();

    });


    asyncTest("tests that Haku starts normally when loader is disabled", function () {
        // enable loader
        haku.settings = {
            onLoading : function(){
                start();
                ok(true);
            },
            loader : {
                "enabled" : false
            }
        }
        // restart haku
        haku.start();

    });

})
