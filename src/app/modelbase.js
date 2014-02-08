var haku = haku || {};

(function(){

    var type = function (args) {
        this.token = args.token ? args.token : "";
        this.userid = args.userid ? args.useid : "";
        this.createdUtc = args.createdUtc ? args.createdUtc : 0;
    };

    klon.register('haku.models.authTokens', type);

}());

(function(){

    // exception with codes
    var type = function (message, code) {
        this.code = code || "";
        this.message = message || "Default Message";
    }
    type.prototype = new Error();
    type.prototype.constructor = type;

    klon.register('haku.models.exception', type);

}());