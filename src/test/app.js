require([], function(){

    "use strict";

    module("Haku tests - Application core", {
        setup: function () {

        },

        teardown: function () {

        }
    });


    // this test should ideally be moved to the klon project
    test("tests multilevel inheritance with base calling", function(){
        var results = [];

        var View1 = Backbone.View.extend({
            name : "1",
            test : function(options, items, things){
                results[0] = "v1|opt:" + options + "|itm:" + items +  "|things:" + things + "|name:" + this.name;
            }
        });

        var View2 = View1.extend({
            name : "2",
            test : function(options, items){
                klon.base(this, "test", arguments,  options, items, "car");
                results[1] = "v2|opt:" + options + "|itm:" + items +  "|name:" + this.name;
            }
        });

        var View3 = View2.extend({
            name : "3",
            test : function(options, items){
                klon.base(this, "test", arguments, options, items);
                results[2] = "v3|opt:" + options + "|itm:" + items +  "|name:" + this.name;
            }
        });

        var view3 = new View3();
        view3.test("bozo", "the clown");
        ok(results[0] === "v1|opt:bozo|itm:the clown|things:car|name:3");
        ok(results[1] === "v2|opt:bozo|itm:the clown|name:3");
        ok(results[2] === "v3|opt:bozo|itm:the clown|name:3");
        ok(results.length === 3);

    });

/*
    // Tests that a minimal haku app can be initialized and started. Override
    test("tests app creation", function(){
        var root = $("<div style='display:none'></div>");
        $('body').append(root);
        klon.register('haku.routers', haku.routers.type().extend({
            initialize : function () {
                klon.base(this, "initialize", arguments );
                this.root = root;
                this.root.html("test passed");
                console.log("router override here");
            }
        }));

        var app = haku.application.instance();
        app.start();

        ok(root.html() === "test passed");
    });
*/
}());
