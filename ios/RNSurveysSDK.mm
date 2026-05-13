#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNSurveysSDK, NSObject)

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

RCT_EXTERN_METHOD(reenableSurveys:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(getAreSurveysDisabled:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end
