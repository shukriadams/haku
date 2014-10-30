/**
 *  Haku : a mobile and web build framework based on Phonegap and Backbone.
 *  @author  Shukri Adams (shukri.adams@gmail.com)
 *
 *  You should implement you app's "main" load point here. Haku will not overwrite this file.
 */

// This is a small example app override. Replace this code with your own app logic.
(function(){

    'use strict';

    /**
    * Simple router to demonstrate application load. Instead of binding to a route
    * and loading a view we write directly to the DOM.
    */
    klon.register('haku.routers', haku.routers.type().extend({

        initialize: function () {
            klon.base(this, "initialize", arguments );
            this.root = $('body');
            this.root.append("Welcome to Haku!");
        }

    }));

    /**
     * Regardless of how you implement your app, you still need to create a Haku app instance and start it.
     */
    var app = haku.application.instance();
    app.start();

}());