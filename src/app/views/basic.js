(function(){

    'use strict';

	klon.register('haku.views.base.basic', Backbone.View.extend({

        // any text written to this will be outputted as view content, unless
        // this.template is set, in which case template is used instead.
        html : "",

        // object will be bound to template
        templateData : null,

        template : null,

        options : null,

        initialize : function(options){
            _.extend(this, options);
            this.options = options;
        },

        transitionIn: function (callback) {

            var view = this;

            var animateIn = function () {
                view.$el.addClass('is-visible');
                view.$el.on('transitionend', function () {
                    if (_.isFunction(callback)) {
                        callback();
                    }
                });
            };

            _.delay(animateIn, 20);

        },

        transitionOut: function (callback) {

            this.$el.addClass('is-visible');
            this.$el.on('transitionend', function () {
                if (_.isFunction(callback)) {
                    callback();
                }
            });

        },

        // override this to load templates for views if the view has important constructor which must fire first
        loadTemplate : function (){ },

        render : function(){
            this.loadTemplate();

            if (this.template){
                this.html = this.template(this.templateData);
            }

            this.$el.html(this.html);
        },

        // called after html in a vew has been appended to page and is visible.
        onShow : function(){

        }

    }));

}());

