Haku
----
Haku is a boilerplate framework for quickly creating Phonegap applications. It has relatively few dependencies, and everything that made it in was chosen for size and performance.

- Implemented in Backbone, it provides a scaffold on which you can create your app as Backbone views. 
- Haku ships with Foundation in Sass mode, so you can change the look and feel of your app quickly.
- Haku provides a series of common utility classes for managing offline data, authentication, page transitions etc. 
- Haku uses Grunt and Bower for build tasks and dependencies. It takes care of the usual HTML minification etc, and also builds a deployable Phonegap binary with a single command. 

Haku would like to be 
- object oriented, at least as much as Javascript permits
- small and generic
- command line friendly so it plays nice with your existing CI flow


Status
------
Haku is still in early alpha. It builds and works, but its structure is still not settled. Use with care.


Coming soon
-----------
- automated Adobe Build integration
- Currently only Android is supported, iOS is incoming.
- better build support on non-Windows systems.

Basic set up
------------
This will get you set up so you can get Haku running in a web browser, and compile your Haku application so it's ready to compile to a Phonegap app.

Haku has the following system dependencies
- Nodejs (for Bower and Grunt, installer from http://nodejs.org)
- Ruby (for changing Foundation with Compass, installer at https://www.ruby-lang.org)
- Bower : "npm install -g bower"
- Grunt : "npm install -g grunt-cli"
- Compass : "gem install compass"
- Foundation : "gem install foundation"


Check out
---------
Get the haku source files from https://github.com/shukriadams/haku and put them in your local work folder. In that folder, at the command prompt, run
- "npm install" (sets up local Grunt modules)
- "grunt --gruntfile deps.js" (gets dependencies like Backbone, and copies them to where they're needed)


View
-----
Haku should now be ready to run in your browser
- fire it up at /src/index.html
- run tests with /src/tests/index.html


Use
---
A very simple example of an app. This uses Requirejs to manage view files, jQuery to trigger override and start, and everything else is standard Backbone router + views.

$(function(){

    klon.register(haku, 'application', haku.application.type().extend({
        initialize : function(){
            klon.base(this, "initialize", arguments);
            require.config({
                paths: {
                    'helloworldview': 'path/to/view/helloworld',
                }
            }); 
        }
    }));

    klon.register(haku , 'routers', haku.routers.type().extend({
        // add routes
        routes : {
        	"hello": "hello"
        },
        // handle routes
        hello : function(){
            require(['helloworldview'], function(){
            	// render view here
            });
        }
    }));

    var app = haku.application.instance();
    app.start();

});



Compile HTML
------------
From the project root
- "grunt --gruntfile compile_X.js" (where X is the target platform) 

The files generated will behave the same as the ones you've viewed in /src, but will have platform-specific settings (if any) applied to them, as well as being minified. You can use these files for building a Phonegap binary for your target platform, either on your own system or via a service like Adobe Build.


Building locally
----------------
You need the JDK and Ant installed and configured on your system as global resources. Depending on which platform you're building for you will also need the Android SDK or XCode on your system, properly configured. This document does not describe how to set those up.
Set up Cordova's CLI with
- "npm install -g cordova"

To build an Android app:
- "build_phonegap_android_headless.bat myNewApp"

This will build an .apk which you can find in myNewApp\platforms\android\bin. If you have a device connected to your system, it will also deploy and start your app on that device.