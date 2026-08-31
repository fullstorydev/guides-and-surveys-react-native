# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-08-31

### Changed

- Replaced the legacy JavaScript survey implementation with native iOS and Android modules, communicating via a TurboModule bridge. This is a breaking change; consumers should follow the updated setup instructions in the README.

### Removed

- Removed the previous pure React Native survey implementation.

## [1.1.0] - 2026-05-05

### Added

- Server-side control over open text answer masking via the `fullstoryExcludeSurveyInputs` setting returned in the `data.json` API response.

### Changed

- Open text survey answers are now masked by default. Masking can be disabled server-side via `fullstoryExcludeSurveyInputs`.

## [1.0.0] - 2026-04-13

- Initial release.
