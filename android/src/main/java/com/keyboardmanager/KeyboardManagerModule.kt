package com.keyboardmanager

import android.graphics.Rect
import android.util.DisplayMetrics
import android.view.ViewTreeObserver
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class KeyboardManagerModule internal constructor(context: ReactApplicationContext) :
  KeyboardManagerSpec(context) {

  private var isKeyboardVisible = false
  private var screenHeight = 0

  // If not in `init` then we need to call this method on the React Native side
  init {
    startKeyboardListener()
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun startKeyboardListener() {
    val rootView = currentActivity?.window?.decorView?.rootView

    val displayMetrics = DisplayMetrics()
    currentActivity?.windowManager?.defaultDisplay?.getMetrics(displayMetrics)
    screenHeight = displayMetrics.heightPixels

    rootView?.viewTreeObserver?.addOnGlobalLayoutListener(object :
      ViewTreeObserver.OnGlobalLayoutListener {
      private val r = Rect()

      override fun onGlobalLayout() {
        rootView.getWindowVisibleDisplayFrame(r)
        val keyboardHeight = screenHeight - r.bottom
        if (keyboardHeight > dpToPx(200) && !isKeyboardVisible) {
          // Keyboard shown
          val params = Arguments.createMap()
          params.putInt("keyboardHeight", pxToDp(keyboardHeight))
          sendEvent("keyboardShown", params)
          isKeyboardVisible = true
        } else if (keyboardHeight <= dpToPx(200) && isKeyboardVisible) {
          // Keyboard dismissed
          val params = Arguments.createMap()
          sendEvent("keyboardDismissed", params)
          isKeyboardVisible = false
        }
      }
    })
  }

  private fun dpToPx(dp: Int): Int {
    val density = reactApplicationContext.resources.displayMetrics.density
    return (dp.toFloat() * density).toInt()
  }

  private fun pxToDp(px: Int): Int {
    val density = reactApplicationContext.resources.displayMetrics.density
    return (px.toFloat() / density).toInt()
  }

  private fun sendEvent(eventName: String, params: WritableMap) {
    reactApplicationContext
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  override fun onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy()
    removeKeyboardListener()
  }

  private fun removeKeyboardListener() {
    val rootView = currentActivity?.window?.decorView?.rootView ?: return
    rootView.viewTreeObserver.removeOnGlobalLayoutListener(null)
  }

  companion object {
    const val NAME = "KeyboardManager"
  }
}
