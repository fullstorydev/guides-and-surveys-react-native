import Foundation
@_spi(FSIntegration) import FullstoryGuidesAndSurveys

/// Plain Swift helper that wraps the native SDK. Not an RN module — the ObjC
/// class RNGuidesAndSurveys in RNGuidesAndSurveys.mm delegates to this via
/// the generated GuidesAndSurveys-Swift.h bridging header.
@objc public class RNGuidesAndSurveysImpl: NSObject {

  @objc public static let shared = RNGuidesAndSurveysImpl()
  private override init() {}

  // ObjC callers always dispatch to the main queue before reaching these
  // methods, so assumeIsolated is a safe assertion here.

  @objc public func initialize(orgId: String, environment: String, userId: String) {
    MainActor.assumeIsolated {
      let env = SurveysEnvironment.from(string: environment)
      SurveysSDK.shared.initialize(
        orgId: orgId,
        environment: env,
        userId: userId.isEmpty ? "anonymous" : userId,
        sessionId: ""
      )
      SurveyHostInstaller.install()
    }
  }

  @objc public func identify(userId: String) {
    MainActor.assumeIsolated {
      SurveysSDK.shared.identify(userId: userId)
    }
  }

  @objc public func showSurvey(surveyId: String?) {
    MainActor.assumeIsolated {
      SurveysSDK.shared.showSurvey(surveyId: surveyId)
    }
  }

  @objc public var areSurveysDisabled: Bool {
    MainActor.assumeIsolated {
      SurveysSDK.shared.areSurveysDisabled
    }
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
