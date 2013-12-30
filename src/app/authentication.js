var haku = haku || {};

// ===========================================================================
// Helper object which internally manages all logic for authentication
// todo : move to own file
// ---------------------------------------------------------------------------
(function () {

    var type = function () {
        this._tokenprovider = haku.remote.tokenProviders.instance();
        this._tokenstore = haku.helpers.tokenStores.instance();
        this.changed = null;  // callback : todo : replace with real event system that supports multiple bindings
        this.isAuthenticated = false;
        this.userid = "";
        this.username = "";
    };

    type.prototype = function () { this.apply(this, arguments); };
    
    type.prototype.login = function (name, password) {
        var token = this._tokenprovider.processLogin(name, password);
        this._tokenstore.store(token);
        this.username = name;
        this.userid = token.userid;
        this.isAuthenticated = true;

        this.trigger("changed", {});
    };

    type.prototype.logout = function () {
        this._tokenstore.remove(token);

        this.trigger("changed", {});
    };

    // add event support
    _.extend(type.prototype, Backbone.Events);

    klon.register(haku, "helpers.authentication", type );

} ());


// ===========================================================================
// Storage manager with memcached-like interface, stores data in browser
// localStorage
// ---------------------------------------------------------------------------
(function(){

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

    klon.register(haku, "helpers.dataStores", "localStorage", type);

}());


// ===========================================================================
// Test stub for remote provider of an authentication token
// todo : move to own file.
// ---------------------------------------------------------------------------
(function () {
    var type = function () {

    };
    type.prototype = function () { this.apply(this, arguments); };
    // todo : design error, token must be return via callback, not synchronously
    type.prototype.processLogin = function (name, password) {
        return haku.models.authTokens.instance({
            token : "test",
            userid : "myid123",
            username : name
        });
    };

    klon.register(haku, "remote.tokenProviders", "test", type);

} ());


// ===========================================================================
// Test stub to token storage. similar to general storage, might have to
// refactor this out.
// todo : move to own file.
// ---------------------------------------------------------------------------
(function () {

    var type = function () {
        this.token = null;
    };
    type.prototype = function () { this.apply(this, arguments); };
    type.prototype.store = function (token) {
        this.token = token;
    };

    type.prototype.remove = function () {
        this.token = null;
    };

    klon.register(haku, "helpers.tokenStores", type);

}());