import UIKit
import FullstoryGuidesAndSurveys

/// Attaches the SDK's survey overlay view controller to the root view controller so
/// surveys can present as native sheets and full-screen covers on top of any RN UI.
@MainActor
enum SurveyHostInstaller {
  private static var overlayViewController: UIViewController?

  static func install() {
    guard overlayViewController == nil else { return }
    guard let overlay = SurveysSDK.shared.makeOverlayViewController() else {
      print("[SurveyHostInstaller] SDK not initialized — call initialize() first.")
      return
    }
    guard let rootVC = keyWindowRootViewController() else {
      print("[SurveyHostInstaller] No key window root view controller found.")
      return
    }

    rootVC.addChild(overlay)
    rootVC.view.addSubview(overlay.view)

    overlay.view.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      overlay.view.topAnchor.constraint(equalTo: rootVC.view.topAnchor),
      overlay.view.bottomAnchor.constraint(equalTo: rootVC.view.bottomAnchor),
      overlay.view.leadingAnchor.constraint(equalTo: rootVC.view.leadingAnchor),
      overlay.view.trailingAnchor.constraint(equalTo: rootVC.view.trailingAnchor),
    ])

    overlay.didMove(toParent: rootVC)
    overlayViewController = overlay
  }

  private static func keyWindowRootViewController() -> UIViewController? {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap { $0.windows }
      .first { $0.isKeyWindow }?
      .rootViewController
  }
}
