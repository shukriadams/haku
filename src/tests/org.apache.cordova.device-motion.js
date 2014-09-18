require(['haku'], function(){

    'use strict';

    module("Haku tests - accelerometer shim", {
        setup: function () {
            require.config({
                paths : {
                    'accelerometer' : '../app/shims/org.apache.cordova.device-motion'
                }
            });
        },

        teardown: function () {

        }
    });


    // ===========================================================================
    // Tests a single response from the accelerometer
    // ---------------------------------------------------------------------------
    asyncTest("Raise an event", function () {

        require(["accelerometer"], function(){

            navigator.accelerometer.shim.x = 1;
            navigator.accelerometer.shim.y = 2;
            navigator.accelerometer.shim.z = 3;

            navigator.accelerometer.watchAcceleration(
                function(acceleration){
                    start();
                    ok(acceleration.x === 1);
                    ok(acceleration.y === 2);
                    ok(acceleration.z === 3);
                },
                null,
                { frequency: 500 }
            );

            navigator.accelerometer.shim.raiseEvent();

        });

    });


}());
