// ===========================================================================
// This is the main Haku file, and the only file which needs to be included in
// your index.html.
// ---------------------------------------------------------------------------

// this is the only global variable creates
var haku = haku || {};

(function(){

    'use strict';

    // create settings Haku needs to start
    haku.settings = haku.settings || {};

    // onready|direct. onready is used for iOS which has a delayed start.
    haku.settings.launchMode='direct';

    // true sends all console.log() output to DOM. Useful for debugging on devices.
    haku.settings.sendConsoleToScreen=false;

    // haku will invoke this callback (if set) instead of invoking ext/app-custom. This is primarily for testing
    haku.settings.onLoaded = null;

    // Must be set to app's content folder on Android & iOS devices.
    haku.settings.systemPathRoot="/";

    // enable console dump to DOM
    if (haku.settings.sendConsoleToScreen) {
        var c = document.getElementById("haku-console");
        if (c === null){
            c = document.createElement("div");
            document.body.appendChild(c);
        }

        (function () {
            var oldLog = console.log;
            console.log = function (message) {
                try {
                    var div = document.createElement("div");
                    div.innerHTML = message;
                } catch (err) {
                    // trap
                }
                c.appendChild(div);
                oldLog.apply(console, arguments);
            };
        })();
    }

    // App load is placed in a document.addEventListener event handler because iOS requires this.
    // On non ios environments, this event is triggered manually.
    document.addEventListener('deviceready', function(){

        require.config({
            baseUrl: haku.settings.systemPathRoot,
            paths: {
                'backbone': '3rdparty/backbone',
                'underscore': '3rdparty/underscore',
                'ejs': '3rdparty/ejs_production',
                'jquery': '3rdparty/jquery',
                'klon': '3rdparty/klon',
                'modernizr': '3rdparty/modernizr',
                'foundation': '3rdparty/foundation',

                'extend': 'ext/app-custom', // your custom app's "main" initial loader must be placed in this file
                'settings-custom' : 'ext/settings-custom',
                'core': 'app/core',
                'exception': 'app/models/exception',
                'authentication': 'app/helpers/authentication',
                'dataStore': 'app/helpers/dataStore',
                'authToken' : 'app/models/authToken',
                'view.ajax': 'app/views/ajax',
                'view.basic': 'app/views/basic',
                'settings': 'app/settings',
                'loader' : 'app/loader',
                'fileSystemShim' : 'app/shims/org.apache.cordova.filesystem'

            },
            shim: {
                'underscore' : { exports: '_' },
                'backbone' : { deps : ['underscore', 'jquery'] },
                'foundation' : { deps : ['jquery'] },
                'settings' : { deps : ['klon', 'underscore'] },
                'authentication' : { deps : ['klon', 'backbone'] },
                'dataStore' : { deps : ['underscore', 'klon'] },
                'exception' : { deps : ['klon'] },
                'authToken' : { deps : ['klon', 'underscore'] },
                'core': { deps : [ 'backbone', 'ejs', 'klon', 'modernizr', 'foundation', 'exception', 'authentication', 'dataStore', 'authToken', 'settings'] },
                'view.basic' : { deps : ['core'] },
                'view.ajax' : { deps : ['view.basic'] },
                'extend' : { deps : ['view.ajax'] }
            }
        });

        require(['underscore','settings-custom'], function(_, settings){

            // pick up settings defined in ext/settings. This is one here before ext content is loaded
            // so we can use Loader if necessary.
            haku.settings = _.extend(haku.settings, settings);

            function onLoad(){
                if (haku.settings.onLoaded){
                    haku.settings.onLoaded();
                } else {
                    require(['extend'], function(){
                        // extension will be loaded here
                    });
                }
            }

            if (haku.settings.enableLoader){
                require(['loader'], function(Loader){
                    new Loader({
                        onLoaded : function(){
                            onLoad();
                        }
                    });
                    // extension will be loaded here
                });
            } else {
                onLoad();
            }

        });

    }, false);


    // manually invoke event in browsers and on Android
    if (haku.settings.launchMode === "direct"){
        document.dispatchEvent(new CustomEvent("deviceready"));
    }


}());

