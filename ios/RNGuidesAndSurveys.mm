#import "RNGuidesAndSurveys.h"
#import "GuidesAndSurveys-Swift.h"

@implementation RNGuidesAndSurveys

RCT_EXPORT_MODULE()

// MARK: - Initialize

RCT_EXPORT_METHOD(initialize:(NSString *)orgId
                  environment:(NSString *)environment
                  userId:(NSString *)userId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[RNGuidesAndSurveysImpl shared] initializeWithOrgId:orgId
                                                 environment:environment
                                                      userId:userId];
        resolve(nil);
    });
}

// MARK: - Identity

RCT_EXPORT_METHOD(identify:(NSString *)userId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[RNGuidesAndSurveysImpl shared] identifyWithUserId:userId];
        resolve(nil);
    });
}

// MARK: - Survey Control

RCT_EXPORT_METHOD(showSurvey:(NSString * _Nullable)surveyId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[RNGuidesAndSurveysImpl shared] showSurveyWithSurveyId:surveyId];
        resolve(nil);
    });
}

RCT_EXPORT_METHOD(getAreSurveysDisabled:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        resolve(@([RNGuidesAndSurveysImpl shared].areSurveysDisabled));
    });
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeGuidesAndSurveysSpecJSI>(params);
}
#endif

@end
