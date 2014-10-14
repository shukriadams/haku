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

    // onready|direct. onready is used for iOS which has a delayed start. none
    haku.settings.launchMode='direct';

    // true sends all console.log() output to DOM. Useful for debugging on devices.
    haku.settings.sendConsoleToScreen=false;

    // haku will invoke this callback when it is about to load extensions
    haku.settings.onLoading = null;

    // Must be set to app's content folder on Android & iOS devices.
    haku.settings.systemPathRoot="/";

    // loader fetches app content and stores it in app media folder on device.
    haku.settings.loader = haku.settings.loader || {};
    haku.settings.loader.enabled = (haku.settings.loader.enabled === null) ? false  : haku.settings.loader.enabled;

    // path to extend. This can be overridden by adding a data attribute anywhere in the DOM.
    // This is primarily intended as a testing backdoor.
    var settingsElement = window.top.document.querySelectorAll('[data-haku-extendPath]');
    haku.settings.extendPath=settingsElement.length > 0 ? settingsElement[0].getAttribute("data-haku-extendPath") :  "ext/app-custom";

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

    //
    haku.start = function(){
        require.config({
            baseUrl: haku.settings.systemPathRoot,
            paths: {
                'backbone' : 'lib/backbone',
                'underscore' : 'lib/underscore',
                'ejs' : 'lib/ejs_production',
                'jquery' : 'lib/jquery',
                'klon' : 'lib/klon',
                'modernizr' : 'lib/modernizr',
                'foundation' : 'lib/foundation',
                'yarn' : 'lib/yarn',

                'haku.extend' : haku.settings.extendPath, // your custom app's "main" initial loader must be placed in this file
                'haku.settings-custom' : 'ext/settings-custom',
                'haku.core' : 'app/core',
                'haku.settings' : 'app/settings',
                'haku.loader' : 'app/loader',
                'haku.fileSystemShim' : 'app/shims/org.apache.cordova.filesystem'

            },
            shim: {
                'underscore' : { exports: '_' },
                'backbone' : { deps : ['underscore', 'jquery'] },
                'foundation' : { deps : ['jquery'] },
                'haku.settings' : { deps : ['klon', 'underscore'] },
                'haku.core': { deps : [ 'backbone', 'ejs', 'klon', 'modernizr', 'foundation', 'haku.settings'] },
                'haku.extend' : { deps : [ 'haku.core' ] }
            }
        });

        // load just enough libs to fetch settings
        require(['underscore','haku.settings-custom'], function(_, settings){

            // pick up settings defined in ext/settings. This is one here before ext content is loaded
            // so we can use Loader if necessary.
            _.extend(haku.settings, settings);

            function loadExtended(){

                if (haku.settings.onLoading){
                    haku.settings.onLoading();
                }

                require(['haku.extend'], function(){
                    // extension will be loaded here
                });
            }

            if (haku.settings.loader.enabled){
                require(['haku.loader'], function(Loader){

                    var loaderOptions = haku.settings.loader;
                    loaderOptions._onLoaded = function(){
                        if (haku.settings.loader.onLoaded)
                            haku.settings.loader.onLoaded();
                        loadExtended();
                    };

                    new Loader(loaderOptions);
                });
            } else {
                loadExtended();
            }

        });
    }


    if (haku.settings.launchMode === "direct"){
        // manually invoke event in browsers and on Android
        haku.start();
    } else if (haku.settings.launchMode === "onready"){
        // App load is placed in a document.addEventListener event handler because iOS requires this.
        // On non ios environments, this event is triggered manually.
        document.addEventListener('deviceready', function(){
            haku.start();
        }, false);
    }

}());

