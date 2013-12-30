(function(){

    'use strict';

    var _store;

    module("Haku tests - data stores", {
        setup: function () {
            _store = haku.helpers.dataStores.instance();
        },

        teardown: function () {

        }
    });


    // ===========================================================================
    // tests simple adding and getting of string from store
    // ---------------------------------------------------------------------------
    test("add and get", function(){
        // setup
        var key = "key";
        var add = "hello";

        // do
        _store.add(key, add);
        var retrieve = _store.get(key);

        // test
        ok(add === retrieve);
    });


    // ===========================================================================
    // tests removing of string from store
    // ---------------------------------------------------------------------------
    test("remove", function(){
        // setup
        var key = "key";

        // do
        _store.add(key, "hello");
        _store.remove(key);

        // test
        var retrieve = _store.get(key);
        ok(retrieve === null);
    });


    // ===========================================================================
    // tests timing out of object in store.
    // ---------------------------------------------------------------------------
    test("expire", function(){
        // setup
        // force backdate on all store objects
        _store.options.stampDate = new Date(2011,11,30);
        var key = "key";

        // do
        _store.add(key, "hello");
        var retrieve = _store.get(key, 1);

        // test
        ok(retrieve === null);
    });


    // ===========================================================================
    // tests clearing all expired items from store
    // ---------------------------------------------------------------------------
    test("clear expired", function(){
        // setup
        // force backdate on all store objects
        _store.options.stampDate = new Date(2011,11,30);
        var key = "key";
        _store.add(key, "hello");

        // do
        _store.clearExpired(1);

        // test
        var retrieve = _store.get(key);
        ok(retrieve === null);
    });


    // ===========================================================================
    // tests that clearing expired expects a timeout value
    // ---------------------------------------------------------------------------
    test("timout expected", function(){
        // do
        try
        {
            _store.clearExpired();
            ok(false, "expected exception not thrown")
        }
        catch(ex)
        {
            // test
            // todo : examine ex message
            ok(true);
        }
    });


    // ===========================================================================
    // Confirms that an old item is not removed from store when no expiry date is
    // provided on retrieval.
    // ---------------------------------------------------------------------------
    test("no expire", function(){
        // setup
        // force backdate on all store objects
        _store.options.stampDate = new Date(2011,11,30);
        var key = "key";
        var value = "hello";
        _store.add(key, value);

        // do
        var retrieve = _store.get(key);

        // test
        ok(retrieve === value);
    });


    // ===========================================================================
    // tests clearing all items from store
    // ---------------------------------------------------------------------------
    test("clear", function(){
        // setup
        var key = "key";
        var add = "hello";
        _store.add(key, add);

        // do
        _store.clear();

        // test
        var retrieve = _store.get(key);
        ok(retrieve === null);
    });

}());
