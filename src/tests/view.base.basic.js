require(['haku'], function(){

    'use strict';

    module("Haku tests - view.base.basic", {
        setup: function () {

        },

        teardown: function () {

        }
    });


    // ===========================================================================
    // Tests that value of .html property is rendered as view content
    // ---------------------------------------------------------------------------
    test("render", function(){
        var view = haku.views.base.basic.instance();
        view.html = "123";
        view.render();
        ok(view.$el.html() === "123")
    });

}());
