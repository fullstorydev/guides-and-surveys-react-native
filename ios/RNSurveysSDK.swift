import Foundation
import GuidesAndSurveysSDK

@objc(RNSurveysSDK)
class RNSurveysSDK: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  // MARK: - Initialize

  @objc func initialize(
    _ orgId: String,
    environment environmentString: String,
    userId: String,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      let environment = SurveysEnvironment.from(string: environmentString)
      SurveysSDK.shared.initialize(
        orgId: orgId,
        environment: environment,
        userId: userId.isEmpty ? "anonymous" : userId,
        sessionId: ""
      )
      SurveyHostInstaller.install()
      resolver(nil)
    }
  }

  // MARK: - Identity

  @objc func identify(
    _ userId: String,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      SurveysSDK.shared.identify(userId: userId)
      resolver(nil)
    }
  }

  // MARK: - Survey Control

  @objc func showSurvey(
    _ surveyId: String?,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      SurveysSDK.shared.showSurvey(surveyId: surveyId)
      resolver(nil)
    }
  }

  @objc func getAreSurveysDisabled(
    _ resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      resolver(SurveysSDK.shared.areSurveysDisabled)
    }
  }
}

// MARK: - SurveysEnvironment string parsing

private extension SurveysEnvironment {
  static func from(string: String) -> SurveysEnvironment {
    switch string.lowercased() {
    case "staging":   return .staging
    case "production": return .production
    default:          return .playpen
    }
  }
}
