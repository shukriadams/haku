(function(){

    // ===========================================================================
    // Running any platform specific startup stuff
    // ---------------------------------------------------------------------------
    $.ajaxSetup({ cache: true }); // fixes dreaded chromium-6 error in Android
    klon.logging = true;


    // ===========================================================================
    // Override settings
    // ---------------------------------------------------------------------------
    _.extend(haku.settings, {
        launchMode : "direct",
        systemPathRoot : "file:///android_asset/www/",
        platform : "android"
    });

}());