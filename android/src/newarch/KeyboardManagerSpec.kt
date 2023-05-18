package com.keyboardmanager

import com.facebook.react.bridge.ReactApplicationContext

abstract class KeyboardManagerSpec internal constructor(context: ReactApplicationContext) :
  NativeKeyboardManagerSpec(context) {

  /*
  We could implement these in the Module instead (KeyboardManagerModule.kt),
  but since they are never called we will implement them here to not pollute
  the Module. The reason these are never called is because we call `addListener`
  from the NativeEventEmitter for the Module instead of on the Module itself.
  */
  override fun addListener(eventName: String) {}
  override fun removeListeners(count: Double) {}
}
