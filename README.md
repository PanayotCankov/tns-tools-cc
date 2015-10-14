# NativeScript Crowd Control
When the apps are too many, and the modules are at loose you need crowd control.

## Getting started
To perform full install and rebuild.
```
npm install
```
This will:
 - Clone in the root of this repo the `NativeScript` and the `cross-platform-modules-dev` if not yet cloned
 - Delete and create the TNSApp with the available (using the globally available 'tns')
 - Build the NativeScript modules and example apps
 - Deploy the NativeScript modules in the TNSApp

Then select and run one of the playground apps in the NativeScript repo:
```
npm run ios -- --app=<app-name>
```
Without `app` parameter will run the tests app as default. 

## To start a watcher that will deploy changes in TNSApp
With this wathcer you will be able to work in the NativeScript repo
and any changes will be moved timely to the TNSApp. TypeScript will be just transpiled
(without full rebuild and type checking)
```
npm run watch
```

**In the `TNSApp` folder** then you should either use `tns run ios` or `tns run android`
eventually with combination of:
```
tns livesync ios --emulator 
```

#### To open the TNSApp in Xcode:
```
npm run xcode
```

#### To manually run in iOS simulator
Tests:
```
npm run ios
```

One of the demo apps:
```
npm run ios -- --app=animations
```
or
```
grunt ios --app=animations
```

#### To manually run in android
Tests:
```
npm run android
```

One of the demo apps:
```
npm run android -- --app=animations
```
or
```
grunt android --app=animations
```
