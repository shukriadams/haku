var haku = haku || {};
haku.settings = haku.settings || {};
haku.settings.systemPathRoot="/";

(function () {

    'use strict';

    require.config({
        baseUrl: haku.settings.systemPathRoot,
        paths: {
            'haku' : 'app/stub',
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