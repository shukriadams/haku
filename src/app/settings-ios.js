// ===========================================================================
// These are settings on ios devices.
// ---------------------------------------------------------------------------
(function(){

    // Running any platform specific startup stuff
    $.ajaxSetup({ cache: true }); // fixes dreaded chromium-6 error in Android
    klon.logging = true;


    // Override settings
    _.extend(haku.settings, {
        launchMode : "onready",
        getSystemPathRootAtStart : true,
        systemPathRoot : "",
        platform : "ios"
    });

}());