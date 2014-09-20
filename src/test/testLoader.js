(function() {

    require.config({
        baseUrl: haku.settings.systemPathRoot,
        paths: {
            'QUnit' : 'test/qunit',
            'app': 'test/app',
            'shim-nfc' : 'app/shims/com.chariotsolutions.nfc.plugin',
            'shim-camera' : 'app/shims/org.apache.cordova.camera',
            // 'haku.fileSystemShim' : already defined in Haku,
            'shim-deviceMotion' : 'app/shims/org.apache.cordova.device-motion',
            'haku.tests.loader' : 'test/loader/tests',
            'typeDeclarations' : 'test/typeDeclarations',
            'cordova.camera' : 'test/org.apache.cordova.camera',
            'nfc' : 'test/com.chariotsolutions.nfc.plugin',
            'helpers.dataStores' : 'test/helpers.dataStores',
            'view.base.ajax' : 'test/view.base.ajax',
            'view.base.basic' : 'test/view.base.basic',
            'helpers.nfc' : 'test/helpers.nfc',
            'cordova.device-motion' : 'test/org.apache.cordova.device-motion'
        },
        shim: {
            'haku.tests.loader' : { deps: [ 'haku.fileSystemShim' ] },
            'cordova.device-motion' : { deps: [ 'shim-deviceMotion' ] },
            'cordova.camera' : { deps: [ 'shim-camera' ] },
            'nfc' : { deps: [ 'shim-nfc' ] },
            'helpers.nfc' : { deps: [ 'shim-nfc' ] },
            'QUnit': {
                exports: 'QUnit',
                init: function() {
                    QUnit.config.autoload = false;
                    QUnit.config.autostart = false;
                }
            }
        }
    });

    require(['QUnit'], function(QUnit){
        require(['app', 'haku.tests.loader'/* 'typeDeclarations', 'cordova.camera', 'nfc', 'helpers.dataStores', 'view.base.ajax', 'view.base.basic', 'cordova.device-motion'*/ ], function(){
            // start QUnit.
            QUnit.load();
            QUnit.start();
        });
    });

})();