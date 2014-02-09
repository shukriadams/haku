// For this demo we use jQuery's domReady to start app. In practice you can launch your app any time
// you know all your required resources are loaded. Phonegap has its own "deviceready" event handler
// to make sure it loads at the right time.
$(function(){

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