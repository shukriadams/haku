(function(){

    'use strict';

    var type = function (args) {
        this.token = args.token ? args.token : "";
        this.userid = args.userid ? args.useid : "";
        this.createdUtc = args.createdUtc ? args.createdUtc : 0;
    };

    klon.register('haku.models.authTokens', type);

}());