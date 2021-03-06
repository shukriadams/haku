(function(){

    'use strict';

    // IMPORTANT : if this throws cross-domain ajax security issue on dev machine, start chrome with "--disable-web-security" switch
    // unless pages are live-updated at startup, this will be the first attempt to get online, so handle breakages here
    klon.register('haku.views.base.ajax', haku.views.base.basic.type().extend({

        url : "",               // REQUIRED.
        storeKey : "",          // REQUIRED.
        storeTimeout : null,    // time in minutes for data to live in store. Optional, integer.
        remoteTimeout : 5000,   //
        started : false,        //

        begin : function(){
            // cannot call multiple loads on an instance of view without resetting, prevents
            // unnecessary calls
            if (this.started)
                return;
            this.started = true;

            if (!this.url || this.url.length === 0)
                throw new Error ("url required");
            if (!this.storeKey || this.storeKey.length === 0)
                throw new Error ("storeKey required");

            // todo : fix this hardcoded reference
            var storage = haku.helpers.dataStores.instance();

            var data = storage.get(this.storeKey, this.storeTimeout);
            if (data){
                this.onData(data);
            } else {
                var self = this;
                $.ajax({
                    url : self.urlAppend(self.url, "__bust", new Date().getTime()),
                    timeout :self.remoteTimeout,
                    success : function(json){
                        storage.add(self.storeKey, json);
                        self.onData(json);
                        self.render(); //repaint
                    },
                    error : function(jqXHR, textStatus, errorThrown){
                        if (jqXHR && jqXHR.status === 404){
                            if (!errorThrown ||errorThrown.length === 0){
                                self.onOffline(jqXHR, textStatus, errorThrown);
                            } else {
                                self.onNotFound(jqXHR, textStatus, errorThrown);
                            }
                        } else {
                            self.onError(jqXHR, textStatus, errorThrown);
                        }
                    }
                });
            }
        },

        // todo : move to utility belt
        urlAppend : function(url, name, value){
            if (url.indexOf('?') === -1)
                url += "?";
            url += "&" + name + "=" + value;
            return url;
        },

        render : function(){
            this.begin();
            haku.views.base.basic.type().prototype.render.call(this);
        },

        // override this with your data rendering logic
        onData : function(data){

        },

        onError : function(jqXHR, textStatus, errorThrown){
            this.html = "something went wrong" + textStatus + "', error : " + errorThrown;
            this.render();
        },

        onNotFound : function(){
            this.html = "Failed to get what you wanted. maybe the service isn't online, or something broken.";
            this.render();
        },

        onOffline : function(){
            this.html = "service unavailable";
            this.render();
        }

    }));

}());