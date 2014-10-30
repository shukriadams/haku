/**
 *  Haku : a mobile and web build framework based on Phonegap and Backbone.
 *  @author  Shukri Adams (shukri.adams@gmail.com)
 *
 *  WARNING : This file is managed by Haku's own build scripts, and may be overwritten as part of the normal build process.
 *  Do not change its contents unless you know what you're doing.
 */

// ===========================================================================
// These are settings on ios devices.
// ---------------------------------------------------------------------------
(function(){

    // Running any platform specific startup stuff
    $.ajaxSetup({ cache: true }); // fixes dreaded chromium-6 error in Android
    klon.logging = true;

    // ios fix adds padding to top of app, making room for notification bar.
    // Note : padding also fixes the error where links are not clickable
    if (window.device && parseFloat(window.device.version) >= 7.0){
        document.body.style.marginTop = "20px";
    }


    // Override settings
    _.extend(haku.settings, {
        launchMode : "onready",
        getSystemPathRootAtStart : true,
        systemPathRoot : "",
        platform : "ios"
    });

}());