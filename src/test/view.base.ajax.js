require([], function(){

    'use strict';

    module("Haku tests - view.base", {
        setup: function () {

        },

        teardown: function () {

        }
    });


    // ===========================================================================
    //
    // ---------------------------------------------------------------------------
    test("url require check", function(){
        var view = haku.views.base.ajax.instance();

        try
        {
            view.render();
        }catch(ex){
            ok(ex.message === "url required");
        }
    });


    // ===========================================================================
    //
    // ---------------------------------------------------------------------------
    test("storekey require check", function(){
        var view = haku.views.base.ajax.instance();
        view.url = "---";

        try
        {
            view.render();
        }catch(ex){
            ok(ex.message.toLowerCase() === "storekey required");
        }
    });


    // ===========================================================================
    // Note : requires disable web security to load cross-domain json
    // ---------------------------------------------------------------------------
    asyncTest("tests successful data retrieval", function () {
        var view = haku.views.base.ajax.instance();
        view.onData = function(data){
            start();
            ok(data === "[]");
        };
        view.url = "emptyArray.json";
        view.storeKey = "123";
        view.render();
    });


}());
