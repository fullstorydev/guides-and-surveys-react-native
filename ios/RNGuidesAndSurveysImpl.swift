import Foundation
@_spi(FSIntegration) import FullstoryGuidesAndSurveys

/// Plain Swift helper that wraps the native SDK. Not an RN module — the ObjC
/// class RNGuidesAndSurveys in RNGuidesAndSurveys.mm delegates to this via
/// the generated GuidesAndSurveys-Swift.h bridging header.
@objc class RNGuidesAndSurveysImpl: NSObject {

  @objc static let shared = RNGuidesAndSurveysImpl()
  private override init() {}

  @objc func initialize(orgId: String, environment: String, userId: String) {
    let env = SurveysEnvironment.from(string: environment)
    SurveysSDK.shared.initialize(
      orgId: orgId,
      environment: env,
      userId: userId.isEmpty ? "anonymous" : userId,
      sessionId: ""
    )
    SurveyHostInstaller.install()
  }

  @objc func identify(userId: String) {
    SurveysSDK.shared.identify(userId: userId)
  }

  @objc func showSurvey(surveyId: String?) {
    SurveysSDK.shared.showSurvey(surveyId: surveyId)
  }

  @objc var areSurveysDisabled: Bool {
    return SurveysSDK.shared.areSurveysDisabled
  }
}

// MARK: - SurveysEnvironment string parsing

private extension SurveysEnvironment {
  static func from(string: String) -> SurveysEnvironment {
    switch string.lowercased() {
    case "staging":    return .staging
    case "production": return .production
    default:           return .playpen
    }
  }
}
