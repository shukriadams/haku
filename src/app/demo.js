// Use jQuery to wait for all base scripts to load, then override bases and start up.
$(function(){

    // ===========================================================================
    // Simple router to demonstrate application load. Requires an html document
    // with a body tag, which, is really not too much to ask.
    // ---------------------------------------------------------------------------
    klon.register(haku , 'routers', haku.routers.type().extend({

        initialize: function () {
            klon.base(this, "initialize", arguments );
            this.root = $('body');
            this.root.append("Welcome to Haku!");
        }

    }));


    // ===========================================================================
    // start app
    // ---------------------------------------------------------------------------
    function start(){
        var app = haku.application.instance();
        app.start();
    }

    if (haku.settings.launchMode === "direct"){
        start();
    } else if (haku.settings.launchMode === "managed"){
        document.addEventListener('deviceready', function(){
            start();
        }, false);
    }

});