(function(){

    'use strict';

    module("Haku tests - shim.hardware.camera", {
        setup: function () {

        },

        teardown: function () {

        }
    });


    // ===========================================================================
    // Tests that the camera success callback returns an image url
    // ---------------------------------------------------------------------------
    asyncTest("Success", function () {
        var imageUrl = "test.jpg";
        navigator.camera.shim.imageUrl = imageUrl;
        navigator.camera.shim.enablePrompt = false;

        var success = function(image){
            start();
            ok(image === imageUrl);
        }

        navigator.camera.getPicture(success);
    });


    // ===========================================================================
    //
    // ---------------------------------------------------------------------------
    asyncTest("Fail", function () {

        navigator.camera.shim.getPictureSuccess = false;
        navigator.camera.shim.enablePrompt = false;
        navigator.camera.shim.errorMessage = "err";

        var error = function(message){
            start();
            ok(message === "err");
        }

        navigator.camera.getPicture(null, error);
    });

}());
