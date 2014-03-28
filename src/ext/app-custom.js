// This is a small example app override. Replace this code with your own app logic.
(function(){

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

    var app = haku.application.instance();
    app.start();

}());