(function(){

    'use strict';

    module("Haku tests - Ensures that all required types have been declared.", {
        setup: function () {

        },

        teardown: function () {

        }
    });

    test("haku", function(){
        ok(klon.is(haku));
    });

    test("haku.routers", function(){
        ok(klon.exists("haku.routers"));
    });

    test("haku.application", function(){
        ok(klon.exists("haku.application"));
    });

    test("haku.authTokens", function(){
        ok(klon.exists("haku.models.authTokens"));
    });

    test("haku.views.base.basic", function(){
        ok(klon.exists("haku.views.base.basic"));
    });
    test("haku.views.base.ajax", function(){
        ok(klon.exists("haku.views.base.ajax"));
    });
}());
