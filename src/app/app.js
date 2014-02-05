/*

 Namespaces reference

 haku.instance.app;             Running instance of app. Global dependency, must be initialized. Starting app sets it.
 haku.instance.router;          Router instance
 haku.instance.settings;        Global settings holder
 haku.instance.storage;         Key-value storage system.
 haku.instance.authentication;  Authentication handler for application (holds tokens, current user id etc)

 haku.application. : app core
 haku.models.authTokens. :
 haku.remote. :                Types which represent calls on remote servers, normally external APIs or suchlike.
 haku.remote.tokenProviders. : Gets authentication tokens. IE, remote logging in happens here.
 haku.routers. :
 haku.settings.
*/

var haku = haku || {};

(function () {

    'use strict';

    // ===========================================================================
    // Base settings : these can be override by settings.js in /app folder.
    // Use a built scrip to override this script with another platform's settings
    // ---------------------------------------------------------------------------
    haku.settings ={
        
        // Standardizes resource urls depending on device - on browsers must be "/",
        // on mobile devices will be an OS specific url fragment.
        systemPathRoot : "OVERRIDE-REQUIRED"

    };


    // ===========================================================================
    // Will be called before haku is started. This is a good place to trigger your
    // own bindings from
    // ---------------------------------------------------------------------------
    haku.initialize = function(){ };


    // ===========================================================================
    // Router. Override this and add routes and route handlers for your own app.
    // ---------------------------------------------------------------------------
    var router = Backbone.Router.extend({
        
        currentView: null,
        root: null,

        initialize: function () {
            // causes routes to appear as full pages
            Backbone.history.start({ pushState: true });
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
    klon.register(haku, 'routers', router);



    // ===========================================================================
    // App. Override this if necessary, then create an instance and .start().
    // ---------------------------------------------------------------------------
    var app = Backbone.Model.extend({
        initialize : function(){
            haku.i._app = this;
        },
        start : function(){

            // start router
            haku.i._router = haku.routers.instance();

            // start foundation. Do this after router initializes with default views
            $(document).foundation();
        }
    });
    klon.register(haku, 'application', app);


    // ===========================================================================
    // Global instances provider
    // ---------------------------------------------------------------------------
    haku.i = {};
    haku.i._app = null;
    haku.i._router = null;
    haku.i._settings = null;
    haku.i._storage = null;
    haku.i._authentication = null;

    haku.i.app = function(){
        if (!haku.i._app)
            throw 'No app instance is running.';
        return haku.i._app;
    };
    haku.i.router = function(){
        if (!haku.i._router)
            throw 'No app instance has started yet.';
        return haku.i._router;
    };
    haku.i.settings = function(){
        if (!haku.i._settings)
            haku.i._settings = haku.settings;
        return haku.i._settings;
    };
    haku.i.authentication = function(){
        if (!haku.i._authentication)
            haku.i._authentication = haku.helpers.authentication.instance();
        return haku.i._authentication;
    };
    haku.i.storage = function(){
        if (!haku.i._storage)
            haku.i._storage = haku.helpers.dataStores.instance();
        return haku.i._storage;
    };


    // ===========================================================================
    // Use to launch app based on Phonegap's own device events.
    // Required by iOS, won't work in a standard browser, not
    // needed by Android.
    // ---------------------------------------------------------------------------
    if (haku.settings.launchMode === "managed"){
        var managedAppLauncher = {

            start: function() {
                document.addEventListener('deviceready', this.onDeviceReady, false);
            },

            onDeviceReady: function() {
                haku.initialize();
                var app = haku.application.instance();
                app.start();
            }

        };
        managedAppLauncher.start();
    }

}());