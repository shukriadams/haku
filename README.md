Haku
====
Haku is a boilerplate for rapidly creating apps that run interchangeably in desktop browsers and within the Phonegap environement. Setting up an app for either is fairly trivial, but getting the same code base to run in both requires a series of compromises and fixes. Haku accumulates and abstracts those fixes, letting you focus on your own code.

- Haku is built entirely on Backbone ; if you're used to Backbone you're well on your way already.
- Haku encourages modular design by using RequireJS and providing its own loader for CSS files. 
- Haku shims most of the standard Phonegap hardware plugins, allowing you to simulate in your desktop browser the standard phone-only components like the camera, gyroscope and others. This means you can write and test phone-specific code on your desktop without having to be tethered to a device.
- ships with build scripts for Phonegap so you can compile immediately. 


Browser support
---------------
Haku requires an HTML5-compatible browser. 


Status
------
Haku is still in alpha. It builds and works, but its structure hasn't settled yet. Use with care.


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
 - Serve Haku from "MyHaku/src" with your favorite web server.
 

Haku update
-----------
From your MyHaku folder
- Run "bower update"
- Run "grunt init". Because the gruntfile has to overwrite itself and the latest version of it may change what it does, it's recommended you run it twice, just to be sure.
Nothing in your /ext and /css-sass folders will be touched, but it's suggested that you backup your work anyway.


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
Please see phonegap.com for detailed instructions on setting up your machine environment for compiling. 

For Android run the MSDOS script with "build_android_headless.bat MyHaku" or, on OSX run bash script with "./build_ios_healdess MyHaku" to create an app called "MyHaku". These scripts are not intended for production use, but it should give you a good idea of how to set up your own build process.


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


Developing
----------
Should you want to develop on the core of Haku,
- Clone the project repo from github
- Run "npm install"
- Run "bower install"
- Run "grunt dev"
- Serve Haku from "/src" with your favorite web server
