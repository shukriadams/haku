
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