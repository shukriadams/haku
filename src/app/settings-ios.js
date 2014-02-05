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
        appName : "MyApp",
        launchMode : "managed",
        systemPathRoot : "file:///var/mobile/Applications/7D6D107B-D9DC-479B-9E22-4847F0CA0C40/" + this.appName + ".app/www/"

    });

}());