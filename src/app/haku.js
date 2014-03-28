// ===========================================================================
// This is the main Haku file, and the only file which needs to be included in
// your index.html. Your application
// ---------------------------------------------------------------------------
'use strict';

var haku = haku || {};
haku.settings = haku.settings || {};
haku.settings.launchMode='direct';

document.addEventListener('deviceready', function(){

    haku.settings.systemPathRoot='/';

    require.config({
        baseUrl: haku.settings.systemPathRoot,
        paths: {
            'extend': 'ext/app-custom', // your custom app's "main" initial loader must be placed in this file
            'core': 'app/core',
            'exception': 'app/models/exception',
            'authentication': 'app/helpers/authentication',
            'dataStore': 'app/helpers/dataStore',
            'authToken' : 'app/models/authToken',
            'view.ajax': 'app/views/ajax',
            'view.basic': 'app/views/basic',
            'settings': 'app/settings'
        },
        shim: {
            'extend' : { deps : ['view.ajax']},
            'view.ajax' : { deps : ['view.basic']},
            'view.basic' : { deps : ['core']},
            'core': { deps : [ 'exception', 'authentication', 'dataStore', 'authToken', 'settings'] }
        }
    });

    require(['extend'], function(){
        // extension will be loaded here
    });

}, false);

if (haku.settings.launchMode === "direct"){
    document.dispatchEvent(new CustomEvent("deviceready"));
}