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

- (void)_setSessionId:(NSString *)sessionId
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[RNGuidesAndSurveysImpl shared] setSessionId:sessionId];
            resolve(nil);
        } @catch (NSException *exception) {
            reject(@"SET_SESSION_ID_ERROR", exception.reason, nil);
        }
    });
}

- (void)_setCurrentScreen:(NSString * _Nullable)screenName
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[RNGuidesAndSurveysImpl shared] setCurrentScreen:screenName];
            resolve(nil);
        } @catch (NSException *exception) {
            reject(@"SET_CURRENT_SCREEN_ERROR", exception.reason, nil);
        }
    });
}

- (void)_getSurveys:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            resolve([[RNGuidesAndSurveysImpl shared] getSurveys]);
        } @catch (NSException *exception) {
            reject(@"GET_SURVEYS_ERROR", exception.reason, nil);
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

RCT_REMAP_METHOD(setSessionId,
                 setSessionIdWithSessionId:(NSString *)sessionId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _setSessionId:sessionId resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(setCurrentScreen,
                 setCurrentScreenWithScreenName:(NSString * _Nullable)screenName
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _setCurrentScreen:screenName resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(getSurveys,
                 getSurveysWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _getSurveys:resolve reject:reject];
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

- (void)setSessionId:(NSString *)sessionId
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject
{
    [self _setSessionId:sessionId resolve:resolve reject:reject];
}

- (void)setCurrentScreen:(NSString * _Nullable)screenName
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
    [self _setCurrentScreen:screenName resolve:resolve reject:reject];
}

- (void)getSurveys:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
    [self _getSurveys:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeGuidesAndSurveysSpecJSI>(params);
}
#endif

@end
