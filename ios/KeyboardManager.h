
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNKeyboardManagerSpec.h"
#import <React/RCTEventEmitter.h>

@interface KeyboardManager : RCTEventEmitter <NativeKeyboardManagerSpec>
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>

@interface KeyboardManager : RCTEventEmitter <RCTBridgeModule>
#endif

@end
