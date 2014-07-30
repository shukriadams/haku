// ===========================================================================
// This is the main Haku file, and the only file which needs to be included in
// your index.html. Your application
// ---------------------------------------------------------------------------
'use strict';

var haku = haku || {};
haku.settings = haku.settings || {};
haku.settings.launchMode='direct';
haku.settings.sendConsoleToScreen=false;

// force console dump to dom
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

document.addEventListener('deviceready', function(){

    haku.settings.systemPathRoot='/';

    require.config({
        baseUrl: haku.settings.systemPathRoot,
        paths: {
            'backbone': '/3rdparty/backbone',
            'underscore': '/3rdparty/underscore',
            'ejs': '/3rdparty/ejs_production',
            'jquery': '/3rdparty/jquery',
            'klon': '/3rdparty/klon',
            'modernizr': '/3rdparty/modernizr',
            'foundation': '/3rdparty/foundation',

            'extend': '/ext/app-custom', // your custom app's "main" initial loader must be placed in this file
            'core': '/app/core',
            'exception': '/app/models/exception',
            'authentication': '/app/helpers/authentication',
            'dataStore': '/app/helpers/dataStore',
            'authToken' : '/app/models/authToken',
            'view.ajax': '/app/views/ajax',
            'view.basic': '/app/views/basic',
            'settings': '/app/settings'
        },
        shim: {
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
            'extend' : { deps : ['view.ajax'] },
            
        }
    });

    require(['extend'], function(){
        // extension will be loaded here
    });

}, false);

if (haku.settings.launchMode === "direct"){
    document.dispatchEvent(new CustomEvent("deviceready"));
}