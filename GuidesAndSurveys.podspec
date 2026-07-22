require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "GuidesAndSurveys"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "12.4" }
  s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }

  # Bridge module only — SDK sources live in FullstoryGuidesAndSurveys
  s.source_files = "ios/**/*.{swift,h,m,mm}"

  # Adds React-Core on old arch and React-RCTFabric + codegen headers on new arch
  install_modules_dependencies(s)

  spm_dependency(s,
    url: "https://github.com/fullstorydev/fullstory-guides-and-surveys-swift-package-ios",
    requirement: { kind: "upToNextMajorVersion", minimumVersion: "0.1.2" },
    products: ["FullstoryGuidesAndSurveys"]
  )
end
