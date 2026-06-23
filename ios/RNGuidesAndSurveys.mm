#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED

// New Architecture: declare conformance to the codegen-generated protocol and
// provide the C++ JSI constructor that the TurboModule system calls.
#import <RNGuidesAndSurveysSpec/RNGuidesAndSurveysSpec.h>
#import "GuidesAndSurveys-Swift.h"

@interface RNGuidesAndSurveys () <NativeGuidesAndSurveysSpec>
@end

@implementation RNGuidesAndSurveys (TurboModule)

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeGuidesAndSurveysSpecJSI>(params);
}

@end

#else

// Old Architecture: register the Swift class and its methods via the ObjC bridge macros.

@interface RCT_EXTERN_MODULE(RNGuidesAndSurveys, NSObject)

RCT_EXTERN_METHOD(initialize:(NSString *)orgId
                  environment:(NSString *)environment
                  userId:(NSString *)userId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(identify:(NSString *)userId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(showSurvey:(NSString * _Nullable)surveyId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(getAreSurveysDisabled:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end

#endif
