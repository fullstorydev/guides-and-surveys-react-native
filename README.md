# @fullstory/guides-and-surveys-react-native

[![CircleCI](https://circleci.com/gh/fullstorydev/guides-and-surveys-react-native.svg?style=svg)](https://circleci.com/gh/fullstorydev/guides-and-surveys-react-native)

Bring FullStory Guides and Surveys into your React Native app. This library bridges to the native FullStory Guides and Surveys SDK on iOS and Android, which fetches survey definitions from FullStory and renders in-app surveys as overlays on top of your existing app UI.

## Quick Links

- [Guides and Surveys Help Center](https://help.fullstory.com/hc/en-us/categories/37618672578455-Guides-and-Surveys)
- [Email us](mailto:mobile-support@fullstory.com)

## Prerequisites

This library requires the following peer dependencies to be installed in your app:

| Package                   | Version    |
| ------------------------- | ---------- |
| `@fullstory/react-native` | `>=1.9.0`  |
| `react-native`            | `>=0.76.0` |

Native platform requirements:

- **iOS**: 17.0+
- **Android**: API 24 (Android 7.0)+

## Installation

```sh
npm install @fullstory/guides-and-surveys-react-native
```

```sh
yarn add @fullstory/guides-and-surveys-react-native
```

### iOS

Run `pod install` in your `ios` directory, then rebuild the app. The survey overlay is attached to your app's key window automatically the first time you call `initialize`.

### Android

The overlay is attached to the current Activity automatically the first time you call `initialize`. No additional setup is required beyond rebuilding the app.

## Usage

### Initialize the SDK

Call `initialize` once, as early as possible (e.g. in a top-level `useEffect`). Every other method is a no-op until this resolves.

```tsx
import { useEffect } from 'react';
import { SurveysSDK } from '@fullstory/guides-and-surveys-react-native';

useEffect(() => {
  SurveysSDK.initialize({ orgId: 'YOUR_ORG_ID' });
}, []);
```

`initialize` accepts:

| Option        | Type                                     | Required | Description                                                                                              |
| ------------- | ---------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `orgId`       | `string`                                 | Yes      | Your FullStory org ID. Must match the org ID configured for the FullStory capture SDK.                   |
| `environment` | `'production' \| 'staging' \| 'playpen'` | No       | API environment to connect to. Defaults to `'production'`.                                               |
| `config`      | `{ language?: string }`                  | No       | `language` sets the language code used to fetch localized survey content. Defaults to the device locale. |

### Target surveys by screen

Report the current screen name so the FullStory panel can target surveys to specific screens using targeting conditions. This example uses React Navigation, but any navigation library works as long as you call `setCurrentScreen` on every screen change.

```tsx
import { useRef } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { SurveysSDK } from '@fullstory/guides-and-surveys-react-native';

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef('');

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name ?? '';
        SurveysSDK.setCurrentScreen(routeNameRef.current);
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name ?? '';
        if (previousRouteName !== currentRouteName) {
          routeNameRef.current = currentRouteName;
          SurveysSDK.setCurrentScreen(currentRouteName);
        }
      }}
    >
      {/* ... */}
    </NavigationContainer>
  );
}
```

## API Reference

| Method                                 | Returns            | Description                                                                                                                                           |
| -------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialize(options)`                  | `Promise<void>`    | Initializes the SDK. Must be called once before any other method.                                                                                     |
| `showSurvey(surveyId?)`                | `Promise<void>`    | Manually shows a survey. Shows the next eligible autoplay survey if omitted.                                                                          |
| `areSurveysDisabled()`                 | `Promise<boolean>` | Returns `true` if surveys are currently suppressed.                                                                                                   |
| `setCurrentScreen(screenName \| null)` | `Promise<void>`    | Sets the current screen name for screen-based survey targeting.                                                                                       |
| `identify(userId)`                     | `Promise<void>`    | Associates an application-level user ID with survey responses. Handled automatically by the native FullStory SDK when calling `Fullstory.identify()`. |
| `anonymize()`                          | `Promise<void>`    | Clears the application-level user ID. Handled automatically by the native FullStory SDK when calling `Fullstory.anonymize()`.                         |
| `setSessionId(sessionId)`              | `Promise<void>`    | Sets the FullStory session ID. Handled automatically by the native FullStory SDK on session start.                                                    |

## License

MIT
