# NativeScript Crowd Control
When the apps are too many, and the modules are at loose you need crowd control.

## Getting Started
To perform full install and rebuild.
```
npm install
```
This will:
 - Clone in the root of this repo the `NativeScript` and the `cross-platform-modules-dev` if not yet cloned
 - Delete and create the TNSApp with the available (using the globally available 'tns')
 - Build the NativeScript modules and example apps
 - Deploy the NativeScript modules in the TNSApp

#### To run in iOS simulator
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

#### To run in android
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

#### To open the TNSApp in Xcode:
```
npm run xcode
```
