import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-keyboard-manager' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const KeyboardManagerModule = isTurboModuleEnabled
  ? require('./NativeKeyboardManager').default
  : NativeModules.KeyboardManager;

const _KeyboardManager = KeyboardManagerModule
  ? KeyboardManagerModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const isIos = Platform.OS === 'ios';

/* 
iOS requires the native module to be passed to not throw an invariant error
but it must be undefined for Android
*/
export const KeyboardManagerEmitter = isIos
  ? new NativeEventEmitter(_KeyboardManager)
  : new NativeEventEmitter();

// KeyboardManagerEmitter.addListener('keyboardShown', () => {});
// KeyboardManagerEmitter.addListener('keyboardDismissed', () => {});

/* 
React Native docs recommend re-exporting the Native Module. We use a custom 
class with static methods so that they're accessed on the class itself
instead of directly accessed on instances of the class.
*/
export class KeyboardManager {
  static didKeyboardShow(callback: any): EmitterSubscription {
    return KeyboardManagerEmitter.addListener('keyboardShown', callback);
  }

  static didKeyboardDismiss(callback: any): EmitterSubscription {
    return KeyboardManagerEmitter.addListener('keyboardDismissed', callback);
  }

  static removeAllListeners(): void {
    KeyboardManagerEmitter.removeAllListeners('keyboardShown');
    KeyboardManagerEmitter.removeAllListeners('keyboardDismissed');
  }
}
