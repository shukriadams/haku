// ===========================================================================
// Recreates Camera object for org.apache.cordova.camera
// ---------------------------------------------------------------------------
(function(){

    var Camera =  {
        DestinationType : {
            DATA_URL : 0,   // Return image as base64 encoded string
            FILE_URI : 1
        },
        PictureSourceType : {
            PHOTOLIBRARY : 0,
            CAMERA : 1,
            SAVEDPHOTOALBUM : 2
        },
        EncodingType : {
            JPEG : 0, // Return JPEG encoded image
            PNG : 1
        },
        PopoverArrowDirection : {
            ARROW_UP : 1,        // matches iOS UIPopoverArrowDirection constants
            ARROW_DOWN : 2,
            ARROW_LEFT : 4,
            ARROW_RIGHT : 8,
            ARROW_ANY : 15
        }
    };

    Camera.CameraPopoverOptions = {
        x : 0,
        y :  32,
        width : 320,
        height : 480,
        arrowDir : Camera.PopoverArrowDirection.ARROW_ANY
    };

    window.navigator.camera = {
        PictureSourceType : Camera.DestinationType.DATA_URL,
        DestinationType : Camera.PictureSourceType.CAMERA,

        // this is a backdoor method Haku atttaches to the camera object to allow its
        // behaviour to be modified. When using a camera object, always check if
        // the shim exists firsts.
        shim : {
            getPictureSuccess : true,
            enablePrompt : true,
            imageUrl : "shims/disposable/org.apache.cordova.camera.testImage.jpg",
            errorMessage : ""
        },

        getPicture : function(success, error, options ){

            var defaultOptions = {
                quality : 0,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: null,
                saveToPhotoAlbum: false
            };

            _.extend(defaultOptions, options);

            if (this.shim.enablePrompt){
                if (confirm("Take picture?")){
                    success(this.shim.imageUrl);
                } else {
                    error(this.shim.errorMessage);
                }
            } else {
                if (this.shim.getPictureSuccess){
                    success(this.shim.imageUrl);
                } else {
                    error(this.shim.errorMessage);
                }

            }
        }
    };

}());