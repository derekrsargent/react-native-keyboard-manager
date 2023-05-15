# react-native-keyboard-manager

An example keyboard manager using Native Modules and Turbo Modules to interface with the native keyboard API for iOS and Android. Do not use in production. 

![](https://github.com/derekrsargent/react-native-keyboard-manager/blob/main/README.gif)

## Usage

Run `yarn` at the root of the project directory to install the dependencies, and either `yarn example ios` or `yarn example android` to run this project. 

```js
import { KeyboardManager } from 'react-native-keyboard-manager';

// ...

KeyboardManager.didKeyboardShow((event: any) => {
    ...
});
```

## Development 

This section provides a description of the development steps used to create this library.

### Commit [b07967a](https://github.com/derekrsargent/react-native-keyboard-manager/commit/b07967a8ce4bc1691750d5a0acac7ea03b97a52a)

In this commit we generate the library scaffolding. In the terminal run `npx create-react-native-library@latest react-native-keyboard-manager` and select `Turbo module with backward compat` for the type of library and `Kotlin & Objective-C` for the languages. (Note: run `yarn` at the root of the project directory to install the dependencies after)

### Commit [3167ec5](https://github.com/derekrsargent/react-native-keyboard-manager/commit/3167ec5b368018db6ceab09b224bd38fbd9da46d)

In this commit we add the Native Module for iOS. An example app is included so that we can test out our library. Update `App.tsx` in this example app. 

Note that `KeyboardManager.mm` (which is an Objective-C++ file type) is included as `KeyboardManager.m` in the Xcode project settings and so you need to manually change the file name from `KeyboardManager.m` to `KeyboardManager.mm` so that Xcode can find it (the file name will be in red to indicate that Xcode cannot find it). This can be done by selecting the file you want to rename in the `Project Navigator` (which can be found on the left side of Xcode) and then select the `File Inspector` (which can be found on the right side of the Xcode) and the file name will be located in `Identity and Type` - edit the file name here and press enter. We need this to be an Objective-C++ file since the New Architecture related code uses C++ for the shared pointers, etc.  

Since we want to emit events, we need to change our `KeyboardManager` to inherit from the superclass `RCTEventEmitter` instead of the default `NSObject` in the class implementation file `KeyboardManager.h`. The angle brackets in the class implementation indicates that our class will conform to the `RCTBridgeModule` protocol. 

In Objective-C, the minus sign (-) at the front of the method name indicates that it is an instance method, which can be called on any instance of the class. This differentiates it from class methods, which can be called on the class itself.

We register the module using the `RCT_EXPORT_MODULE()` macro. By using the `RCT_EXPORT_MODULE()` macro we export and register this native module class with React Native and usable on the React Native side through `NativeModules`. If we do not explicitly pass in a class name to this macro it will use the Objective-C class name as the default (in our case `KeyboardManager`).

In the context of React Native modules, the `@synthesize` directive is used to synthesize the bridge property, which is a reference to the `RCTBridge` instance that manages the module. The `bridge` property is commonly used to communicate with the React Native bridge and send events, invoke methods, and access other module-related functionality. By explicitly specifying the backing instance variable, it allows you to have more control over the variable's scope and access. It also helps avoid potential naming conflicts if there are other variables or parameters with the same name.

The `startObserving` method (and also `stopObserving`, `supportedEvents`, etc) of a native module are automatically called by the framework when the module is registered with the React Native bridge. The module registration process is handled behind the scenes by React Native. When you register a native module in React Native, the framework initializes the module and calls its `init` method to perform any necessary setup. After that, React Native automatically calls the `startObserving` method if it is implemented in the module. The exact point at which the `startObserving` method is called depends on the module's lifecycle and when it is registered. Typically, the registration process occurs when the React Native bridge is set up and the JavaScript side requests the module from the native side. The automatic calling of `startObserving` allows the module to start listening for events or perform any necessary setup for event handling. It ensures that the module is prepared to handle events and communicate with the React Native bridge.

In our `index` file we then re-export a `KeyboardManager` class to make it more portable as a library.

### Commit [c0f8fdc](https://github.com/derekrsargent/react-native-keyboard-manager/commit/c0f8fdc49fa445d33dfad0bc96029f320e254d9e)

In this commit we add the Native Module for Android. We create a `KeyboardManager` class and implement the `startKeyboardListener()` method that adds a `ViewTreeObserver.OnGlobalLayoutListener` to the root view of the activity. Inside the listener, we calculate the keyboard height based on the visible window frame and emit the appropriate event (`keyboardShown` or `keyboardDismissed`) to React Native using the `sendEvent()` function.

The `onCatalystInstanceDestroy` method is a lifecycle method in React Native Android modules that is called when the React Native JavaScript runtime is destroyed. This method is called when the React Native bridge is shut down or when the module is being removed from the React Native application. When the `onCatalystInstanceDestroy` method is called, the Android module should release any resources that were acquired during its initialization and allocation. This could include releasing any event listeners, stopping any background tasks, or cleaning up any other resources that were allocated during the lifecycle of the module.

The `dpToPx` method is used to convert a value from Density-independent Pixels (dp) to Pixels (px). In Android, dp is a unit of measurement that scales with the device's screen density, while px represents actual screen pixels. When working with dimensions or measurements in Android, it is recommended to use dp instead of px. By using dp, you can ensure that your app's UI elements scale appropriately across different devices with varying screen densities. The `pxToDp` method is also required in our class for the reverse conversion since the display metrics provide a value in pixels. 

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
