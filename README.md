Haku
----
Haku is a boilerplate for rapidly creating Phonegap applications. It is an opinionated build script in that it consists
of cherry-picked components, tied together in a way that is easy to reuse and extend. It is a framework in that its
structure encourages code reuse.

Haku
- is implemented with Backbone; it provides a scaffold on which you can create your app as Backbone views.
- assumes you're going to use Require to spread your apps over different files.
- ships with Foundation in Sass mode, so you can change the look and feel of your app quickly.
- provides a series of common utility classes for managing offline data, authentication, page transitions etc. 
- uses Grunt and Bower for build tasks and dependencies. It takes care of the usual HTML minification etc, 
- compiles to HTML which can in turn seamlessly compile to Phonegap with the Cordova CLI or Adobe Build. 

Haku would like to be 
- object oriented, at least as much as Javascript permits
- small and generic
- command line friendly so it plays nice with your existing CI flow


Status
------
Haku is still in early alpha. It builds and works, but its structure hasn't settled yet. Use with care.


Coming soon
-----------
- automated Adobe Build integration
- better build support on non-Windows systems.


System set up
------------
Haku has the following system dependencies 
- Nodejs (for Bower and Grunt, installer from http://nodejs.org)
- Ruby (for changing Foundation with Compass, installer at https://www.ruby-lang.org)
- Bower : "npm install -g bower"
- Grunt : "npm install -g grunt-cli"
- Compass : "gem install compass"
- Foundation : "gem install foundation"


Haku set up
-----------
 - Create a folder for your new Haku project, say "MyHaku". Open a console window here.
 - Run "bower install https://github.com/shukriadams/haku.git#master" 
 - From  /bower_components/haku copy package.json, grunfile.js & bower.json to your "MyHaku" folder. 
 - Run "npm install" to install all required node packages.
 - Run "grunt init" to set everything else up
 - Serve haku from "MyHaku/src" with your favorite web server.
 

Haku update
-----------
You can keep your Haku files up-to-date - from your "MyHaku" folder
- Run "bower install https://github.com/shukriadams/haku.git#master" 
- Run "grunt init"
Nothing in your /ext and /css-sass folders will be touched, but it's suggested that you stash your work anyway.


Extending
---------
Haku is mostly left alone to do its own thing. You in turn do all your work in the /ext folder, which Haku will not 
updated after first being installed. Haku hooks into your code by expecting to find /ext/app-custom.js ; from within this file, use require.js to load your own files, and tell Haku to start. Haku is based on Backbone, so if you're used to that, you're set. 

This is a simple example.

	// jquery fires up app when the DOM has loaded, but any DOM loader will do
	$(function(){

		// override the haku application, add your own app logic	
	    klon.register('haku.application', haku.application.type().extend({
	        initialize : function(){

	        	// this calls the base initialize() method in the class we inherit from (haku.application).
	        	// Haku base classes have their own logic. You are free to override them, but do call them
	            klon.base(this, "initialize", arguments);

				// use Requirejs to add a view
	            require.config({
	                paths: {
	                    'helloworldview': 'path/to/view/helloworld',
	                }
	            }); 
	        }
	    }));


	    // override haku's router
	    klon.register('haku.routers', haku.routers.type().extend({
	        
	        // add a route
	        routes : {
	        	"hello": "hello"
	        },

	        // handle route
	        hello : function(){
	            require(['helloworldview'], function(){
	            	// render view here
	            });
	        }
	    }));


	    // instantiate app and start it	
	    var app = haku.application.instance();
	    app.start();

	});



Prepare for Phonegap
--------------------
From the project root
- "grunt [platform]" (where [platform] is the target platform being built. Allowed options are : "android", "ios" or "web" ) 

The files generated will behave the same as the ones you've viewed in /src, but will have platform-specific settings (if any) applied to them, as well as being minified. You can use these files for building a Phonegap binary for your target platform, either locally (see next section) or via a service like Adobe Build. Haku also builds to vanilla web.


Compiling Phonegap binaries
---------------------------
Please see phonegap.com for detailed build instructions. An example MSDOS build script for Android is included - run "build_phonegap_android_headless.bat MyHaku" to create an app called "MyHaku". This script is not intended for production use, but it should give you a good idea of how to set up the compilation process.


Go deeper
---------
Haku is essentially a buildable mobile app with its own build script. However, if you want to build something really complex inside of it, you'll probably want to set up your own build scripts too. You can get Haku to call these when it builds.

Create a gruntSettings.js file in your "MyHaku" folder. In it, add the lines

	exports.precompileGrunt = "mySubfolder/myGruntfile.js myTask";
	exports.workDirectory = "mySubfolder/src";
	exports.precompileDirectory = "mySubfolder/precompile";

Then inside of "mySubfolder", create your own script grunt script(s). 
Run "grunt init" from inside "MyHaku". Haku will unpack itself inside of "mySubfolder/src", which will become your new work root.

Now let's build Haku for the web - from "MyHaku", run "Grunt web". Haku will call "mySubfolder/myGruntfile.js myTask" (mytask is optional). Make sure your own grunt script dumps its final output in "mySubfolder/precompile". Haku will pick up everything here and continue its web build.
