/*

 Namespaces reference

 haku.app;             Running instance of app. Global dependency, must be initialized. Starting app sets it.
 haku.router;          Router instance
 haku.settings;        Global settings holder
 haku.storage;         Key-value storage system.
 haku.authentication;  Authentication handler for application (holds tokens, current user id etc)

 haku.application. : app core
 haku.models.authTokens. :
 haku.remote. :                Types which represent calls on remote servers, normally external APIs or suchlike.
 haku.remote.tokenProviders. : Gets authentication tokens. IE, remote logging in happens here.
 haku.routers. :

*/

var haku = haku || {};

(function () {

    'use strict';

    // ===========================================================================
    // Base settings : these must be override by settings.js in /app folder.
    // ---------------------------------------------------------------------------
    haku.settings = {

        // Standardizes resource urls depending on device - on browsers must be "/",
        // on mobile devices will be an OS specific url fragment.
        systemPathRoot : "OVERRIDE-REQUIRED",
        getSystemPathRootAtStart : false,
        launchMode : "OVERRIDE-REQUIRED",
        platform : "OVERRIDE-REQUIRED"

    };


    // ===========================================================================
    // Router. Override this and add routes and route handlers for your own app.
    // ---------------------------------------------------------------------------
    var router = Backbone.Router.extend({
        
        currentView: null,
        root: null,

        initialize: function () {
            // causes routes to appear as full pages
            Backbone.history.start({ pushState: true });

            // get absolute path of app resources - required by ios
            if (haku.settings.getSystemPathRootAtStart){
                haku.settings.systemPathRoot = window.location.pathname.replace("index.html", "");
            }
        },

        // transitions page view in. If page supports sliding transition,
        // slide is done. Else a hard attachment is done.
        _showPageView: function (view) {

            // removes old page out, if page supports t
            var previousView = self.currentView || null;
            if (previousView && previousView.transitionOut) {
                previousView.transitionOut(function () {
                    previousView.remove();
                });
            }

            view.render();
            view.$el.addClass('page');

            if (view.transitionIn) {
                view.transitionIn();
            }

            self.currentView = view;

            this.root.empty();
            this.root.append(view.$el);

            // call method that tells view its content is now visible
            if (view.__proto__.hasOwnProperty("onShow")){
                view.onShow();
            }
        }

    });
    klon.register('haku.routers', router);



    // ===========================================================================
    // App. Override this if necessary, then create an instance and .start().
    // ---------------------------------------------------------------------------
    var app = Backbone.Model.extend({
        initialize : function(){
            haku.i.app = this;
        },
        start : function(){

            // start router
            haku.router = haku.routers.instance();

            // start foundation. Do this after router initializes with default views
            $(document).foundation();
        }
    });
    klon.register('haku.application', app);


    // ===========================================================================
    // Global instances provider
    // ---------------------------------------------------------------------------
    haku.i = {};
    haku.app = haku.app || null;
    haku.router = haku.router|| null;
    haku.settings = haku.settings|| null;
    haku.storage = haku.storage || null;
    haku.authentication = haku.authentication || null;
    haku.storage = haku.storage || null;

}());