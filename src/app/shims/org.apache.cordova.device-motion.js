// ===========================================================================
// Recreates accelerometer object for org.apache.cordova.device-motion
// ---------------------------------------------------------------------------
(function(){

    "use strict";

    klon.register("navigator.accelerometer");

    navigator.accelerometer.shim = {
        x : 0,
        y : 0,
        z : 0,

        timerId : null,

        frequency : 1000,

        successCallback : null,

        errorCallback : null,

        start : function(){
            if (this.timerId != null || this.successCallback == null){
                return;
            }

            var self = this;
            this.timerId = setInterval(function(){

                self.successCallback({
                    x : self.x,
                    y : self.y,
                    z : self.z
                })
            }, this.frequency);

        },

        stop : function(){
            if (this.timerId == null){
                return;
            }

            clearInterval(this.timerId);
            this.timerId = null;
        },

        raiseError : function(){
            if (this.errorCallback){
                this.errorCallback();
            }
        },

        raiseEvent : function(){
            var self = this;
            this.successCallback({
                x : self.x,
                y : self.y,
                z : self.z
            });
        }
    };

    navigator.accelerometer.watchAcceleration = function(success, error, options){
        this.shim.successCallback = success;
        this.shim.errorCallback = error;
        this.shim.frequency = options.frequency;
    };

}());