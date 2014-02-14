require(['haku'], function(){

    'use strict';

    module("Haku tests - camera shim", {
        setup: function () {
            require.config({
                paths : {
                    'camera' : '../shims/org.apache.cordova.camera'
                }
            });
        },

        teardown: function () {

        }
    });


    // ===========================================================================
    // Tests that the camera success callback returns an image url
    // ---------------------------------------------------------------------------
    asyncTest("Take a photo", function () {

        require(["camera"], function(){

            var imageUrl = "test.jpg";
            navigator.camera.shim.imageUrl = imageUrl;
            navigator.camera.shim.enablePrompt = false;

            var success = function(image){
                start();
                ok(image === imageUrl);
            }

            navigator.camera.getPicture(success);

        });

    });


    // ===========================================================================
    //
    // ---------------------------------------------------------------------------
    asyncTest("Cancel", function () {

        require(["camera"], function(){

            navigator.camera.shim.getPictureSuccess = false;
            navigator.camera.shim.enablePrompt = false;
            navigator.camera.shim.errorMessage = "err";

            var error = function(message){
                start();
                ok(message === "err");
            }

            navigator.camera.getPicture(null, error);

        });

    });

}());
