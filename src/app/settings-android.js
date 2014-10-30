/**
 *  Haku : a mobile and web build framework based on Phonegap and Backbone.
 *  @author  Shukri Adams (shukri.adams@gmail.com)
 *
 *  WARNING : This file is managed by Haku's own build scripts, and may be overwritten as part of the normal build process.
 *  Do not change its contents unless you know what you're doing.
 */

// ===========================================================================
// These are settings for Android devices.
// ---------------------------------------------------------------------------
(function(){

    // Running any platform specific startup stuff
    $.ajaxSetup({ cache: true }); // fixes dreaded chromium-6 error in Android
    klon.logging = true;


    // Override settings
    _.extend(haku.settings, {
        launchMode : "direct",
        systemPathRoot : "file:///android_asset/www/",
        platform : "android"
    });

}());