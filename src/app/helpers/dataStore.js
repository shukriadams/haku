// ===========================================================================
// Storage manager with memcached-like interface, stores data in browser
// localStorage
// ---------------------------------------------------------------------------
(function(){

    'use strict';

    var type = function(options){
        var defaults = {
            // Tor testing purposes only. Allows us to force store object timestamps.
            stampDate : null
        };
        this.options = _.extend(defaults, options);
    };
    type.prototype = function () { this.apply(this, arguments); };


    type.prototype.add = function(key, item){
        var ingoing =
        {
            data : item,
            timestamp : this.options.stampDate ? this.options.stampDate : new Date().getTime()
        };
        localStorage.setItem(key, JSON.stringify(ingoing));
    };

    // timeout in minutes. Optional.
    type.prototype.get = function(key, timeout){
        var raw = localStorage.getItem(key);
        if (!raw){
            return null;
        }
        var parsed = null;

        try
        {
            parsed = JSON.parse(raw);
        }
        catch(ex){

            if(ex.message && ex.message.toLowerCase().indexOf("unexpected token") !== -1){
                // json is corrupt, clear and move on
                this.remove(key);
                return null;
            } else{
                throw ex;
            }

        }

        // check timeout, remove object if expired
        if (klon.is(timeout) && parsed.timestamp){
            var maxAge = new Date(parsed.timestamp);
            maxAge.setMinutes(maxAge.getMinutes() + timeout);
            if (new Date() > maxAge){
                this.remove(key);
                return null;
            }
        }

        return parsed.data;
    };

    // Removes an item with the given key from the store
    type.prototype.remove = function(key){
        localStorage.removeItem(key);
    };

    // Removes all items from the store
    type.prototype.clear = function(){
        localStorage.clear();
    };

    // Removes expired items from store. Runs through all items in store, so might be slow.
    // Timeout in minutes
    type.prototype.clearExpired = function(timeout){
        if (!klon.is(timeout))
            throw 'Timeout (in minutes) is required.';

        for (var key in localStorage){
            this.get(key, timeout);
        }
    };

    klon.register('haku.helpers.dataStores', 'localStorage', type);

}());