#import "RNGuidesAndSurveys.h"
#import "GuidesAndSurveys-Swift.h"

@implementation RNGuidesAndSurveys

RCT_EXPORT_MODULE()

// MARK: - Private helpers

- (void)_initialize:(NSString *)orgId
        environment:(NSString *)environment
             userId:(NSString *)userId
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[RNGuidesAndSurveysImpl shared] initializeWithOrgId:orgId
                                                     environment:environment
                                                          userId:userId];
            resolve(nil);
        } @catch (NSException *exception) {
            reject(@"INIT_ERROR", exception.reason, nil);
        }
    });
}

- (void)_identify:(NSString *)userId
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[RNGuidesAndSurveysImpl shared] identifyWithUserId:userId];
            resolve(nil);
        } @catch (NSException *exception) {
            reject(@"IDENTIFY_ERROR", exception.reason, nil);
        }
    });
}

- (void)_showSurvey:(NSString * _Nullable)surveyId
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[RNGuidesAndSurveysImpl shared] showSurveyWithSurveyId:surveyId];
            resolve(nil);
        } @catch (NSException *exception) {
            reject(@"SHOW_SURVEY_ERROR", exception.reason, nil);
        }
    });
}

- (void)_getAreSurveysDisabled:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            resolve(@([RNGuidesAndSurveysImpl shared].areSurveysDisabled));
        } @catch (NSException *exception) {
            reject(@"GET_SURVEYS_DISABLED_ERROR", exception.reason, nil);
        }
    });
}

// MARK: - Old arch (bridge)

RCT_REMAP_METHOD(initialize,
                 initializeWithOrgId:(NSString *)orgId
                 environment:(NSString *)environment
                 userId:(NSString *)userId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _initialize:orgId environment:environment userId:userId resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(identify,
                 identifyWithUserId:(NSString *)userId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _identify:userId resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(showSurvey,
                 showSurveyWithSurveyId:(NSString * _Nullable)surveyId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _showSurvey:surveyId resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(getAreSurveysDisabled,
                 getAreSurveysDisabledWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _getAreSurveysDisabled:resolve reject:reject];
}

#ifdef RCT_NEW_ARCH_ENABLED

// MARK: - New arch (TurboModule)

- (void)initialize:(NSString *)orgId
       environment:(NSString *)environment
            userId:(NSString *)userId
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
    [self _initialize:orgId environment:environment userId:userId resolve:resolve reject:reject];
}

- (void)identify:(NSString *)userId
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject
{
    [self _identify:userId resolve:resolve reject:reject];
}

- (void)showSurvey:(NSString * _Nullable)surveyId
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
    [self _showSurvey:surveyId resolve:resolve reject:reject];
}

- (void)getAreSurveysDisabled:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
    [self _getAreSurveysDisabled:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeGuidesAndSurveysSpecJSI>(params);
}
#endif

@end
