/**
 *  Haku : a mobile and web build framework based on Phonegap and Backbone.
 *  @url https://github.com/shukriadams/haku
 *  @author  Shukri Adams (shukri.adams@gmail.com)
 *
 *  WARNING : This file is managed by Haku's own build scripts, and may be overwritten as part of the normal build process.
 *  Do not change its contents unless you know what you're doing.
 */

/*
 Namespaces reference

 haku.app;             Running instance of app. Global dependency, must be initialized. Starting app sets it.
 haku.router;          Router instance
 haku.settings;        Global settings holder

 haku.application. :   App class (type).

*/

(function () {

    'use strict';

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
            var previousView = this.currentView || null;
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

            this.currentView = view;

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
            haku.app = this;
        },

        /**
         * Loads a CSS file dynamically; use this as workaround to lack of RequireJS css loader
         * @param {string} href - Path to css file
         * @param {string} [id] - Optional unique key for resource. Assign a key to an href if you want to replace it a later stage with something else.
         * */
        requireCss : function (href, key){

            // partial IE 7 fallback. Reimplement unique checks.
            if (document.createStyleSheet)
            {
                document.createStyleSheet(href);
                return;
            }

            var head = document.getElementsByTagName("head")[0];
            var fileRef;

            if (key)
                fileRef = head.querySelectorAll('link[id="' + key + '"]');
            else
                fileRef = head.querySelectorAll('link[href="' + href + '"]');

            if (fileRef && fileRef.length === 0) {
                fileRef = document.createElement("link");
            } else {
                fileRef = fileRef[0];
            }

            // note : append element BEFORE setting attributes, due to an IE quirk
            head.appendChild(fileRef);

            fileRef.setAttribute("type", "text/css");
            fileRef.setAttribute("rel", "stylesheet");
            if (key){
                fileRef.setAttribute("id", key);
            }

            // note : href must be added LAST because of an IE quirk
            fileRef.setAttribute("href", href);

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
    haku.app = null;
    haku.router = null;
    haku.settings = haku.settings || null;
    haku.authentication = null;
    haku.storage = null;

}());