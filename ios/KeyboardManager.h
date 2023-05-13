
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNKeyboardManagerSpec.h"

@interface KeyboardManager : NSObject <NativeKeyboardManagerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface KeyboardManager : NSObject <RCTBridgeModule>
#endif

@end
