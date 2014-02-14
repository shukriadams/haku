require(['haku'], function(){

    'use strict';

    module("Haku tests - nfc shim", {
        setup: function () {
            require.config({
                paths : {
                    'nfc' : '../shims/com.chariotsolutions.nfc.plugin'
                }
            });
        },

        teardown: function () {

        }
    });


    // ===========================================================================
    // Tests that shim's onWrite callback is invoked when the tag is written to
    // ---------------------------------------------------------------------------
    asyncTest("Write callback", function () {

        require(["nfc"], function(){

            nfc.shim.onWrite = function(){
                start();
                ok(nfc.shim.data.length === 1);
                ok(nfc.shim.data[0] === "test");
            };

            nfc.write(["test"]);

        });

    });

}());
