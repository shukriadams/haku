(function(){

    'use strict';

    /*
    // structure of tag item

    var TagItem = {
        type : "",
        content : ""
    };
    */

    var nfcHelper = {

        // gets array of tagItems from the NFC tag. Returns empty array if tag is empty.
        readItems : function (tagData){
            var result = [];

            if (tagData.ndefMessage && tagData.ndefMessage.length > 0){
                for(var i = 0 ; i < tagData.ndefMessage.length ; i ++){
                    var item = tagData.ndefMessage[i];

                    var payload = item.payload ? nfc.bytesToString(item.payload) : "";
                    var type = item.type ? nfc.bytesToString(item.type) : "";

                    result.push({
                        type : type,
                        content : payload
                    });
                }
            }

            return result;
        },


        // writes the given items to the NFC tag.
        writeItems : function( items, onSuccess, onError ){
            var records = [];

            for (var i = 0 ; i < items.length ; i ++){

                var item = items[i];
                var bytes = nfc.stringToBytes(item.content);
                var record = ndef.mimeMediaRecord(item.type, bytes);

                records.push(record);
            }

            nfc.write( records,  onSuccess,  onError );
        },


        // clears the NFC tag
        clearTag : function( onSuccess, onError ){
            nfc.erase( onSuccess, onError );
        },


        // returns true if the given array of tagItems can fit on the NFC tag.
        // Note : it isn't yet known if the byte length calculation given
        // below is correct.
        fitsOnTag : function(items, tagData){
            var length = 0;
            for (var i = 0 ; i < items.length ; i ++){

                var item = items[i];
                length += nfc.stringToBytes(item.content).length;
                length += nfc.stringToBytes(item.type).length;
            }

            return length < tagData.maxSize;
        },

        //
        bind : function(onSuccess, onError){
            if (onError == undefined)
                onError = null;

            nfc.addNdefListener(
                function(nfcEvent){
                    onSuccess(nfcEvent);
                },
                function() {
                    // start alert, ignore
                },
                onError
            );

            nfc.addTagDiscoveredListener(
                function(nfcEvent){
                    onSuccess(nfcEvent);
                },
                function() {
                    // start alert, ignore
                },
                onError
            );
        }

    };

    klon.register("haku.helpers", "nfc", nfcHelper);

}());