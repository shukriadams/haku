APPNAME=$1 

if [ -z "$APPNAME" ]; then
	echo "Error : app name is required. Terminating script."
	exit 1
fi

npm install
grunt ios
cordova create $APPNAME com.example.hello $APPNAME
cp -r compile_ios/. $APPNAME/www/ 

cd $APPNAME
cordova platform add ios
cordova build
