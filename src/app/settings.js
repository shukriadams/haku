/*
These are standard "desktop" browser settings, intended for development use.
*/
(function(){

    // ===========================================================================
    // Running any platform specific startup stuff
    // ---------------------------------------------------------------------------
    klon.logging = true;


    // ===========================================================================
    // Override settings
    // ---------------------------------------------------------------------------
    _.extend(haku.settings, {
        systemPathRoot : "/"
    });

}());