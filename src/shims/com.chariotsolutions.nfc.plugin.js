// ===========================================================================
// Recreates Camera object for org.apache.cordova.camera.
// All structures are sourced from
// https://github.com/chariotsolutions/phonegap-nfc
// ---------------------------------------------------------------------------
(function(){

    // replica of nfcEvent raised when tag is read by device.
    var nfcEvent = {
        tag : {
            isWriteable : true,
            id : [1,2,3,4,5,6,-7], // 7 digit array
            techTypes : ["android.nfc.tech.NfcA", "android.nfc.tech.MifareUltralight", "android.nfc.tech.Ndef"], // array of tag types
            type : "NFC Forum Type 2",
            canMakeReadOnly : true,
            maxSize : 137,          // fixed to tag.
            ndefMessage : [
                {
                    id : [],        // seems optional
                    type : [],      // int array (byte data)
                    payload: [],    // int array (byte data)
                    tnf : 0
                }
            ]
        }
    };

    var nfc = {

        // this is a backdoor method Haku atttaches to the nfc object to allow its
        // behaviour to be modified. When using the nfc object, always check if
        // the shim exists firsts.
        shim : {

            // mime type to watch for.
            watchMimeType : null,

            //
            onError : null,

            // callback, invoked when write occurs
            onWrite : null,

            // callback, invoked when erase occurs
            onErase : null,

            // callback from client.
            onTag : null,

            // invoke this to trigger the callback for when a tag is detected
            raiseDetect : function(items){

                // write data items to tag event
                nfcEvent.tag.ndefMessage = [];

                // if nothing passed in and local data is available, take local
                if (!items && this.data){
                    items = this.data;
                }

                // if no data is available at all, create empty array
                if (!items) {
                    items = [];
                }

                for (var i = 0 ; i < items.length ; i++){
                    nfcEvent.tag.ndefMessage.push({
                        id : [],
                        type : [items[i].type],
                        payload : [items[i].content],
                        tnf : 0
                    });
                }

                if (this.onTag){
                    this.onTag(nfcEvent);
                }
            },

            // invoke this to trigger the callback for when a tag detection error occurs.
            raiseDetectError : function(message){
                if (this.shim.onError){
                    this.shim.onError(message);
                }
            },

            // set to true if erase should raise an error
            errorOnErase : false,

            // message returned if erase error occurs
            errorOnEraseMessage : "error",

            // holds data that was written to tag. data is not actual nfc items but
            // { type : "string", content : "string" }
            data : [],

            // set to true if write must raise an error
            errorOnWrite : false,

            // message returned if write raises an error
            errorOnWriteMessage : "error"
        },

        //
        addNdefListener : function( onEvent, onStart, onError ){
            this.shim.onTag = onEvent;
            this.shim.onError = onError;
            if (onStart)
                onStart();
        },

        //
        addTagDiscoveredListener : function( onEvent, onStart, onError){
            this.shim.onTag = onEvent;
            this.shim.onError = onError;
            if (onStart)
                onStart();

       },

        //
        addMimeTypeListener : function(mimeType, onEvent, onStart, onError){
            this.shim.onTag = onEvent;
            this.shim.onError = onError;
            this.shim.watchMimeType = mimeType;
            if (onStart)
                onStart();
        },

        // erases all data from tag
        erase  : function(onEvent, onError){

            if (this.shim.onErase){
                this.shim.onErase();
            }

            if (this.shim.errorOnErase)
                onError(this.shim.errorOnEraseMessage);
            else
                onEvent();
        },

        // items : array of properly formatted objects to write to tag
        // onEvent : invoked if write succeeds.
        // onError : invoked if write fails. Returns a string message
        write : function(items, onEvent, onError){

            this.shim.data = items;

            if (this.shim.onWrite){
                this.shim.onWrite();
            }

            if (this.shim.errorOnWrite && onError)
                onError(this.shim.errorOnWriteMessage);
            else if (onEvent)
                onEvent();
        },

        // supposed to convert string to byte array. Instead returns string as is.
        stringToBytes : function(string){
            return string;
        },

        // supposed to convert a byte array to string. Shim has a string array instead
        // of int, return first item in array
        bytesToString : function(items){
            if (items.length > 0)
                return items[0];

            return null;
        }
    };

    var ndef = {
        // supposed to create a mime record. instead returns object
        mimeMediaRecord : function(mimeType, bytes ){
            return {
                type : mimeType,
                content : bytes
            }
        }
    };

    window.nfc = nfc;
    window.ndef = ndef;
}());