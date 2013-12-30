:: App name MUST be passed in
SET appName=%1


:: ==============================================
:: Compile HTML and JS
:: install everything
:: ==============================================
call npm install
call grunt --gruntfile compile_android.js



:: ==============================================
:: Create project structure
:: ==============================================
call cordova create %appName% com.example.hello %appName%



:: ==============================================
:: delete any existing HTML content in phonegap 
:: resource folder, but save config.xml
:: ==============================================
copy %appName%\www\config.xml %appName%
rmdir %appName%\www /s /q
MKDIR %appName%\www
copy %appName%\config.xml %appName%\www\
DEL %appName%\config.xml



:: ==============================================
:: copy compiled html/js to resource folder
:: ==============================================
robocopy compile_android %appName%\www /e /xf *.bat cordova.js


:: ==============================================
:: Within app folder, set up android, and add
:: device plugins
:: ==============================================
cd %appName%
call cordova platform add android
call cordova plugin add org.apache.cordova.camera


:: ==============================================
:: Build and push to device. Done.
:: ==============================================
call cordova build
call cordova run android

pause