ionic capacitor add android
ionic build
npx cap sync android
cd android
./gradlew assembleDebug
adb.exe -s $1 install -r ./android/app/build/outputs/apk/debug/app-debug.apk 