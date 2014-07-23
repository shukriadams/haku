// shim for bluetooth.le

var bluetoothle = function(){};

bluetoothle.shim = {
    interval : 1000,
    isInitialized : false,
    isScanning : false,
    readingIndex : 0,
    readings : [ ],     // array of array of readings. Use this to create a series of readings over time { address : "beaconid", rssi : 0}. These readings will be returned for each scan interval
    intervalId : null
};


bluetoothle.initialize = function(success, fail){

    var isSuccess = true;

    if (isSuccess){
        this.shim.isInitialized = true;
        success({ status : "initialized" });
    } else {
        fail({ error : "error code needed", message : "message needed"});
    }

};

bluetoothle.isInitialized = function(callback){
    callback({ isInitialized : this.shim.isInitialized });
};

bluetoothle.isScanning = function(callback){
    callback({ isScanning : this.shim.isScanning });
};


bluetoothle.startScan = function(success, fail, filters){
    // ignore filters for now

    var isSuccess = true;
    var self = this;

    this.shim.isScanning = true;
    this.shim.intervalId = setInterval(function(){
        if (isSuccess){

            if (self.shim.readingIndex >= self.shim.readings.length) {
                self.shim.readingIndex = 0;
            }
            var readAtIndex = self.shim.readingIndex;

            if (self.shim.readings.length > 0){
                for (var i = 0 ; i < self.shim.readings[readAtIndex].length ; i ++){
                    var reading = self.shim.readings[readAtIndex][i];
                    success({ status : "scanResult", address : reading.address, rssi : reading.rssi });
                }
            }

            self.shim.readingIndex = readAtIndex + 1;

        } else {
            fail( { status : "status needed" } );
        }

    }, this.shim.interval );
};

bluetoothle.stopScan = function(success, fail){
    if (this.shim.intervalId) {
        clearInterval(this.shim.intervalId);
        this.shim.intervalId = null;
    }

    var isSuccess = true;
    if (isSuccess) {
        success();
    } else {
        fail();
    }
};