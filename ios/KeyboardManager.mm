#import "KeyboardManager.h"

@implementation KeyboardManager

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

/*
 Can add these notification dispatch mechanism by overridding `init` instead, if so need to also
 override requiresMainQueueSetup
 */
- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidShow:) name:UIKeyboardDidShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidHide:) name:UIKeyboardDidHideNotification object:nil];
}

// RCTBridge class requires `supportedEvents` method to be overwridden
- (NSArray<NSString *> *)supportedEvents {
    return @[@"keyboardShown", @"keyboardDismissed"];
}

// Override `dealloc` if overridding `init` instead of `startObserving`
- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)keyboardDidShow:(NSNotification *)notification {
    CGRect keyboardFrame = [[[notification userInfo] objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue];
    CGFloat keyboardHeight = CGRectGetHeight(keyboardFrame);
    
    NSDictionary *eventData = @{
        @"keyboardHeight": @(keyboardHeight)
    };
    
    [self sendEventWithName:@"keyboardShown" body:eventData];
}

- (void)keyboardDidHide:(NSNotification *)notification {
    [self sendEventWithName:@"keyboardDismissed" body:nil];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeKeyboardManagerSpecJSI>(params);
}
#endif

@end
