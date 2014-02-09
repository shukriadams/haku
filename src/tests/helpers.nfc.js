(function(){

    'use strict';

    module("Haku tests - NFC shim", {
        setup: function () {
            require.config({
                paths : {
                    'nfc' : '../app/helpers/nfc',
                    'shim' : '../shims/com.chariotsolutions.nfc.plugin'
                },
                shim : {
                    'nfc' : { deps : [ 'shim']}
                }
            });
        },

        teardown: function () {

        }
    });


    // ===========================================================================
    // Tests that items are written to tag
    // ---------------------------------------------------------------------------
    asyncTest("Write tag", function () {
        require(["nfc"], function(){

            var items = [
                { type : "123", content : "321"},
                { type : "abc", content : "cba"}
            ];

            haku.helpers.nfc.writeItems(items, function(){
                start();

                ok(nfc.shim.data.length === 2);
                ok(nfc.shim.data[0].type === "123");
                ok(nfc.shim.data[0].content === "321");
                ok(nfc.shim.data[1].type === "abc");
                ok(nfc.shim.data[1].content === "cba");

            }, null);

        });
    });

    // ===========================================================================
    // Tests that items are read from a tag
    // ---------------------------------------------------------------------------
    asyncTest("Read tag", function () {
        require(["nfc"], function(){

            nfc.shim.data = [
                { type : "123", content : "321"},
                { type : "abc", content : "cba"}
            ];

            nfc.addNdefListener(
                function(nfcEvent){
                    start();

                    var items = haku.helpers.nfc.readItems(nfcEvent.tag);

                    ok(items.length === 2);
                    ok(items[0].type === "123");
                    ok(items[0].content === "321");
                    ok(items[1].type === "abc");
                    ok(items[1].content === "cba");

                }
            );

            // trigger a tag detection
            nfc.shim.raiseDetect();

        });
    });

}());
