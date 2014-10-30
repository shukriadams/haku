/**
 *  Haku : a mobile and web build framework based on Phonegap and Backbone.
 *  @author  Shukri Adams (shukri.adams@gmail.com)
 *
 *  WARNING : This file is managed by Haku's own build scripts, and may be overwritten as part of the normal build process.
 *  Do not change its contents unless you know what you're doing.
 */

// Use require to load haku scripts, and then start app.
require(['haku'], function(){

    'use strict';

    // ===========================================================================
    // Simple router to demonstrate application load. Requires an html document
    // with a body tag, which, is really not too much to ask.
    // ---------------------------------------------------------------------------
    klon.register('haku.routers', haku.routers.type().extend({

        initialize: function () {
            klon.base(this, "initialize", arguments );
            this.root = $('body');
            this.root.append("Welcome to Haku!");
        }

    }));


    // ===========================================================================
    // start app
    // ---------------------------------------------------------------------------
    document.addEventListener('deviceready', function(){
        var app = haku.application.instance();
        app.start();
    }, false);

    if (haku.settings.launchMode === "direct"){
        document.dispatchEvent(new CustomEvent("deviceready"));
    }

});