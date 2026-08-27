#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNGuidesAndSurveysSpec/RNGuidesAndSurveysSpec.h>

// New arch: inherit from the codegen-generated base class so the TurboModule
// system can find and instantiate this module via JSI.
@interface RNGuidesAndSurveys : NativeGuidesAndSurveysSpecBase
@end

// Declare protocol conformance in the same translation unit as the @interface
// so the class extension is valid (matches FullStory's FullStory.h pattern).
@interface RNGuidesAndSurveys () <NativeGuidesAndSurveysSpec>
@end

#else

// Old arch: plain NSObject with RCTBridgeModule; methods are discovered via
// RCT_EXPORT_MODULE / RCT_EXPORT_METHOD macros in the .mm file.
@interface RNGuidesAndSurveys : NSObject <RCTBridgeModule>
@end

#endif
