import Foundation
@_spi(FSIntegration) import FullstoryGuidesAndSurveys

/// Plain Swift helper that wraps the native SDK. Not an RN module — the ObjC
/// class RNGuidesAndSurveys in RNGuidesAndSurveys.mm delegates to this via
/// the generated GuidesAndSurveys-Swift.h bridging header.
@objc @MainActor public class RNGuidesAndSurveysImpl: NSObject {

  @objc public static let shared = RNGuidesAndSurveysImpl()
  private override init() {}

  // ObjC callers always dispatch to the main queue before reaching these
  // methods, which is what makes @MainActor isolation here sound.

  @objc public func initialize(
    orgId: String,
    environment: String,
    config: NSDictionary?
  ) {
    let env = SurveysEnvironment.from(string: environment)
    let language = config?["language"] as? String
    let surveysConfig = language.map { SurveysConfig(language: $0) } ?? SurveysConfig()

    SurveysSDK.shared.initialize(
      orgId: orgId,
      environment: env,
      config: surveysConfig
    )

    SurveyHostInstaller.install()
  }

  @objc public func identify(userId: String) {
    SurveysSDK.shared.identify(userId: userId)
  }

  @objc public func anonymize() {
    SurveysSDK.shared.anonymize()
  }

  @objc public func showSurvey(surveyId: String?) {
    SurveysSDK.shared.showSurvey(surveyId: surveyId)
  }

  @objc public var areSurveysDisabled: Bool {
    SurveysSDK.shared.areSurveysDisabled
  }

  @objc public func setSessionId(_ sessionId: String) {
    SurveysSDK.shared.setSessionId(sessionId)
  }

  @objc public func setCurrentScreen(_ screenName: String?) {
    SurveysSDK.shared.setCurrentScreen(screenName)
  }
}

// MARK: - SurveysEnvironment string parsing

private extension SurveysEnvironment {
  static func from(string: String) -> SurveysEnvironment {
    switch string.lowercased() {
    case "staging":    return .staging
    case "production": return .production
    case "playpen":    return .playpen
    default:           return .production
    }
  }
}
