// ===========================================================================
// Recreates accelerometer object for org.apache.cordova.device-motion
// ---------------------------------------------------------------------------
(function(){
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
            if (this.shim.timerId != null || this.shim.successCallback == null){
                return;
            }

            var self = this;
            this.shim.timerId = setInterval(function(){

                self.successCallback({
                    x : self.shim.x,
                    y : self.shim.y,
                    z : self.shim.z
                })
            }, this.frequency);

        },

        stop : function(){
            if (this.shim.timerId == null){
                return;
            }

            clearInterval(this.shim.timerId);
            this.shim.timerId = null;
        },

        raiseError : function(){
            if (this.shim.errorCallback){
                this.shim.errorCallback();
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