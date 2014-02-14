// ===========================================================================
// This is the main Haku file, and the only file which needs to be included in
// your index.html.
//
// Require 'haku' to load the core of the haku app.
// ---------------------------------------------------------------------------
var haku = haku || {};

(function () {

    'use strict';

    haku.settings = haku.settings || {};
    haku.settings.systemPathRoot="/";

    require.config({
        baseUrl: haku.settings.systemPathRoot,
        paths: {
            'haku' : 'app/stub', // main require thread
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
            'haku' : { deps : ['view.ajax']},
            'view.ajax' : { deps : ['view.basic']},
            'view.basic' : { deps : ['core']},
            'core': { deps : [ 'exception', 'authentication', 'dataStore', 'authToken', 'settings'] }
        }
    });

}());