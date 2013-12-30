// Use jQuery to wait for all base scripts to load, then override bases and start up.
$(function(){


    // ===========================================================================
    // Simple router to demonstrate application load. Requires an html document
    // with a body tag, which, is really not too much to ask.
    // ---------------------------------------------------------------------------
    klon.register('routers', haku.routers.type().extend({

        onInitialized: function () {
            this.root = $("body");
            this.root.html("Welcome to Haku!");
        }

    }));


    // ===========================================================================
    // start app
    // ---------------------------------------------------------------------------
    var app = haku.application.instance();
    app.start();

});