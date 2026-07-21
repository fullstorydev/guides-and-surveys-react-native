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

  @objc public func initialize(
    orgId: String,
    environment: String,
    config: NSDictionary?
  ) {
    MainActor.assumeIsolated {
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
  }

  @objc public func identify(userId: String) {
    MainActor.assumeIsolated {
      SurveysSDK.shared.identify(userId: userId)
    }
  }

  @objc public func anonymize() {
    MainActor.assumeIsolated {
      SurveysSDK.shared.anonymize()
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

  @objc public func setSessionId(_ sessionId: String) {
    MainActor.assumeIsolated {
      SurveysSDK.shared.setSessionId(sessionId)
    }
  }

  @objc public func setCurrentScreen(_ screenName: String?) {
    MainActor.assumeIsolated {
      SurveysSDK.shared.setCurrentScreen(screenName)
    }
  }

  @objc public func getSurveys() -> NSArray {
    MainActor.assumeIsolated {
      guard let repo = SurveysSDK.shared.getRepository() else {
        NSException(
          name: NSExceptionName("NOT_INITIALIZED"),
          reason: "SDK not initialized",
          userInfo: nil
        ).raise()
        return NSArray()
      }
      let completedIds = Set(repo.progressorData.uf_completed.map { $0.id })
      let surveys: [[String: Any]] = repo.surveys.map { survey in
        [
          "id": survey.id,
          "name": survey.name,
          "active": survey.active,
          "priority": survey.objectPriority,
          "pageType": (survey.pages.first?.type.rawValue ?? "unknown").uppercased(),
          "questionCount": survey.pages.reduce(0) { $0 + $1.questions.count },
          "completed": completedIds.contains(survey.id),
        ]
      }
      return surveys as NSArray
    }
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
