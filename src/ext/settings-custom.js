define('settings-custom', [ ], function(){

    "use strict";

    /* DO NOT COMMIT THIS. OBVIOUSLY, YOU WILL */
    return {
        enableLoader : true,
        loaderSettings : {
            "appName" : "myApp",
            "appTitle" : "My App",
            "enable" : false,
            "enableLogging" : true,
            "verboseLogging" : true,
            "url" : "http://localhost:8000/ext/loader-manifest.json",
            "assetsMode" : "files",
            "forceFullFetch" : true
        }
    };
});
