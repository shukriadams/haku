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

    klon.register('haku.helpers.authentication', type );

} ());




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

    klon.register('haku.remote.tokenProviders', 'test', type);

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

    klon.register('haku.helpers.tokenStores', type);

}());