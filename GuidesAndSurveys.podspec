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

  # Bridge module only — SDK sources live in GuidesAndSurveysSDK
  s.source_files = "ios/**/*.{swift,h,m,mm}"

  s.dependency "React-Core"
  s.dependency "GuidesAndSurveysSDK"
end
