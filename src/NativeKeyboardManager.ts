import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /* 
  These are needed here even though `addListener` is called on the 
  NativeEventEmitter (which already has an `addListener` method available) 
  and not the Module itself. If these are not added then the event won't be 
  received on the React Native side. And so, the `addListener` and `removeListeners` 
  implementations will be provided by React Native.
  */
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('KeyboardManager');
