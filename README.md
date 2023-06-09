# react-native-keyboard-manager

An example keyboard manager using Native Modules and Turbo Modules to interface with the native keyboard API for iOS and Android. Do not use in production. 

The Keyboard was selected as the native API to interface with since it works well on both the iOS simulator and Android emulator. The purpose of this example is to showcase emitting events from the native side to React Native since the documentation on this is rather lacking for Turbo Modules. Regular functions, such as *multiply*, are well documented in the React Native docs.

![](https://github.com/derekrsargent/react-native-keyboard-manager/blob/main/README.gif)

## Usage

Run `yarn bootstrap` at the root of the project directory to install all dependencies and pods, and then either `yarn example ios` or `yarn example android` to run this project. 

```js
import { KeyboardManager } from 'react-native-keyboard-manager';

// ...

KeyboardManager.didKeyboardShow((event: any) => {
    // ...
});
```

## Development 

This section provides a description of the development steps used to create this library.

### Commit [b07967a](https://github.com/derekrsargent/react-native-keyboard-manager/commit/b07967a8ce4bc1691750d5a0acac7ea03b97a52a)

In this commit we generate the library scaffolding. In the terminal run `npx create-react-native-library@latest react-native-keyboard-manager` and select `Turbo module with backward compat` for the type of library and `Kotlin & Objective-C` for the languages. (Note: run `yarn bootstrap` at the root of the project directory to install the dependencies and pods after).

### Commit [3167ec5](https://github.com/derekrsargent/react-native-keyboard-manager/commit/3167ec5b368018db6ceab09b224bd38fbd9da46d)

In this commit we add the Native Module for iOS. An example app is already included from the previous scaffolding so that we can test out our library. Update `App.tsx` in this example app. 

Note that `KeyboardManager.mm` (which is an Objective-C++ file type) is included as `KeyboardManager.m` (a regular Objective-C file without C++ support) in the Xcode project settings and so you need to manually change the file name from `KeyboardManager.m` to `KeyboardManager.mm` so that Xcode can find it (the file name will be in red to indicate that Xcode cannot find it). This can be done by selecting the file you want to rename in the `Project Navigator` (which can be found on the left side of Xcode) and then select the `File Inspector` (which can be found on the right side of the Xcode) and the file name will be located in `Identity and Type` - edit the file name here and press enter. We need this to be an Objective-C++ file since the New Architecture related code uses C++ for the shared pointers, etc.  

Since we want to emit events, we need to change our `KeyboardManager` to inherit from the superclass `RCTEventEmitter` instead of the default `NSObject` in the class interface file `KeyboardManager.h`. The angle brackets in the class interface indicates that our class will conform to the `RCTBridgeModule` protocol. 

In Objective-C, the minus sign (-) at the front of the method name indicates that it is an instance method, which can be called on any instance of the class. This differentiates it from class methods, which can be called on the class itself.

We register the module using the `RCT_EXPORT_MODULE()` macro. By using the `RCT_EXPORT_MODULE()` macro we export and register this native module class with React Native and usable on the React Native side through `NativeModules`. If we do not explicitly pass in a class name to this macro it will use the Objective-C class name as the default (in our case `KeyboardManager`).

In the context of React Native modules, the `@synthesize` directive is used to synthesize the bridge property, which is a reference to the `RCTBridge` instance that manages the module. The `bridge` property is commonly used to communicate with the React Native bridge and send events, invoke methods, and access other module-related functionality. By explicitly specifying the backing instance variable, it allows you to have more control over the variable's scope and access. It also helps avoid potential naming conflicts if there are other variables or parameters with the same name.

The `startObserving` method (and also `stopObserving`, `supportedEvents`, etc) of a native module are automatically called by the framework when the module is registered with the React Native bridge. The module registration process is handled behind the scenes by React Native. When you register a native module in React Native, the framework initializes the module and calls its `init` method to perform any necessary setup. After that, React Native automatically calls the `startObserving` method if it is implemented in the module. The exact point at which the `startObserving` method is called depends on the module's lifecycle and when it is registered. Typically, the registration process occurs when the React Native bridge is set up and the JavaScript side requests the module from the native side. The automatic calling of `startObserving` allows the module to start listening for events or perform any necessary setup for event handling. It ensures that the module is prepared to handle events and communicate with the React Native bridge.

In our `index` file we then re-export a custom `KeyboardManager` class to make it more portable as a library.

### Commit [c0f8fdc](https://github.com/derekrsargent/react-native-keyboard-manager/commit/c0f8fdc49fa445d33dfad0bc96029f320e254d9e)

In this commit we add the Native Module for Android. We create a `KeyboardManager` class and implement the `startKeyboardListener()` method that adds a `ViewTreeObserver.OnGlobalLayoutListener` to the root view of the activity. Inside the listener, we calculate the keyboard height based on the visible window frame and emit the appropriate event (`keyboardShown` or `keyboardDismissed`) to React Native using the `sendEvent()` function.

The `onCatalystInstanceDestroy` method is a lifecycle method in React Native Android modules that is called when the React Native JavaScript runtime is destroyed. This method is called when the React Native bridge is shut down or when the module is being removed from the React Native application. When the `onCatalystInstanceDestroy` method is called, the Android module should release any resources that were acquired during its initialization and allocation. This could include releasing any event listeners, stopping any background tasks, or cleaning up any other resources that were allocated during the lifecycle of the module.

The `dpToPx` method is used to convert a value from Density-independent Pixels (dp) to Pixels (px). In Android, dp is a unit of measurement that scales with the device's screen density, while px represents actual screen pixels. When working with dimensions or measurements in Android, it is recommended to use dp instead of px. By using dp, you can ensure that your app's UI elements scale appropriately across different devices with varying screen densities. The `pxToDp` method is also required in our class for the reverse conversion since the display metrics provide a value in pixels. 

### Commit [ad680cd](https://github.com/derekrsargent/react-native-keyboard-manager/commit/ad680cd9a1b643e5d02d99705fa4b453c3c71289)

In this commit we enable the new architecture and add the Turbo Module for iOS. First, run the command `RCT_NEW_ARCH_ENABLED=1 yarn example pods` to generate the pods using the new architecture. By setting the `RCT_NEW_ARCH_ENABLED` environment variable to `1` we are indicating that the new architecture should be enabled. An alternate way of doing this is to explicitly adding `ENV["RCT_NEW_ARCH_ENABLED"]="1"` in the Podfile located in the `example/ios/` folder and then running `yarn example pods`. This will also generate the Codegen files in the `example/ios/build/RNKeyboardManagerSpec/` folder, which includes the `RNKeyboardManagerSpec.h` header file which is used as a protocol for the `KeyboardManager` class interface. 

To compare, the `KeyboardManager` class interface with the new architecture (Turbo Modules): 
```objectivec
@interface KeyboardManager : RCTEventEmitter <NativeKeyboardManagerSpec>
```

And the `KeyboardManager` class interface with the old architecture (Native Modules):  
```objectivec
@interface KeyboardManager : RCTEventEmitter <RCTBridgeModule>
```

We can see from this that we don't use the JS Bridge anymore, but instead we use the new JS Interface (JSI). The JSI is a mechanism that allows synchronous and direct communication between JavaScript and native code without the need for the traditional asynchronous bridge-based communication. Turbo Modules leverage the JSI to improve the performance of Native Module operations in React Native. With the JSI, Turbo Modules can directly interact with JavaScript objects and functions, eliminating the overhead of serialization/deserialization and bridging between JavaScript and native code. By using the JSI, Turbo Modules can achieve faster method calls, reduced memory footprint, and improved interoperability between JavaScript and native code.

A note that if we remove the `NativeKeyboardManagerSpec` protocol from the `KeyboardManager` class interface that we wouldn't need to add the `addListener` and `removeListeners` to the Turbo Module spec and the emitted events would be received on the React Native side. However, we then couldn't declare any regular methods (non-event driven) like `add` or `multiply` in the Turbo Module spec and so that solution is only valid when the Turbo Module will *only* be emitting events.

When metro is running, we can confirm that the app is using the new architecture by looking out specifically for `"fabric":true` and `"concurrentRoot":true` (a reminder that Fabric is the rendering engine that was introduced in the new architecture).  
`LOG  Running "KeyboardManagerExample" with {"fabric":true,"initialProps":{"concurrentRoot":true},"rootTag":1}`

To compare, when metro is running with the old architecture the log shows:  
`LOG  Running "KeyboardManagerExample" with {"rootTag":1,"initialProps":{}}`

### Commit [0db7cfb](https://github.com/derekrsargent/react-native-keyboard-manager/commit/0db7cfbcf78cb7984cc589fc3990784fa788796b)

In this commit we enable the new architecture and add the Turbo Module for Android. The abstract class definition for the new architecture is automatically used by changing the source directory from `oldarch` to `newarch` based on a conditional in `build.gradle`:   
```java
abstract class KeyboardManagerSpec internal constructor(context: ReactApplicationContext) :
  NativeKeyboardManagerSpec(context) {
}
```
Comparing this to the old architecture:  
```java
abstract class KeyboardManagerSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {
}
```
We can see that the only difference is that we are now invoking the constructor of the `NativeKeyboardManagerSpec` class instead of the `ReactContextBaseJavaModule` class.  

`NativeKeyboardManagerSpec(context)` is invoking the constructor of the `NativeKeyboardManagerSpec` class with the `context` parameter. When a class extends another class, the parent class constructor can be invoked using the `super` keyword followed by parentheses with the necessary arguments. In this case, `NativeKeyboardManagerSpec(context)` is calling the constructor of the `NativeKeyboardManagerSpec` class and passing the `context` parameter to it. The return type of the class is `KeyboardManagerSpec`. The `abstract` keyword indicates that the class is abstract, meaning it cannot be instantiated directly (does not have an implementation in its class) but must be subclassed. The `internal` modifier specifies that the class is only accessible within the same module. The constructor parameter `context` is of type `ReactApplicationContext`. We subclass this abstract class in the `KeyboardManagerModule` class where we previously implemented our `startKeyboardListener`, `dpToPx`, `pxToDp`, `sendEvent` etc methods.  

The `NativeKeyboardManagerSpec` is created by Codegen and is generated in `android/build/generated/source/codegen/java/com/keyboardmanager/NativeKeyboardManagerSpec.java`.  

If we run the project without any changes we'll get the following build errors:  
`Class 'KeyboardManagerModule' is not abstract and does not implement abstract base class member public abstract fun addListener(eventName: String): Unit defined in com.keyboardmanager.KeyboardManagerSpec`  
and,  
`Class 'KeyboardManagerModule' is not abstract and does not implement abstract base class member public abstract fun removeListeners(count: Double): Unit defined in com.keyboardmanager.KeyboardManagerSpec`

We also need to include the override modifier or we'll get the following build errors:  
`'addListener' hides member of supertype 'KeyboardManagerSpec' and needs 'override' modifier.`
`'removeListeners' hides member of supertype 'KeyboardManagerSpec' and needs 'override' modifier.`  

By implementing these two missing methods we get a successful build (they do not need the `@ReactMethod` decorator but this allows us to access these methods from the React Native side if required). We should note that these two methods are never actually called. This is because we call `addListener` on the `NativeEventEmitter` of the Module and not the Module itself, and so React Native provides the `addListener` implementation. We need to provide `addListener` and `removeListeners` in the Turbo Module spec for iOS or else the emitted events from native won't be received on the React Native side. Because these two are included in the Turbo Module spec, we need to implement dummy methods for them on Android to avoid a compile error. To run the project using the new architecture run the command `ORG_GRADLE_PROJECT_newArchEnabled=true yarn example android` (an alternate method of enabling the new architecture is to change the `newArchEnabled` boolean to `true`, 
```java
newArchEnabled=true
```
in `example/android/gradle.properties`).

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
