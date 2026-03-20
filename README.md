# @fullstory/guides-and-surveys-react-native

Bring FullStory Guides and Surveys into your React Native app. This library fetches survey definitions from FullStory, and renders in-app surveys as overlays on top of your existing app UI.

## Prerequisites

This library requires the following peer dependencies to be installed in your app:

| Package                                     | Version    |
| ------------------------------------------- | ---------- |
| `@fullstory/react-native`                   | `>=1.9.0`  |
| `@react-native-async-storage/async-storage` | any        |
| `@react-navigation/native`                  | `>=6.0.0`  |
| `react-native-gesture-handler`              | `>=2.16.1` |
| `react-native-reanimated`                   | `>=2.0.0`  |
| `react-native-webview`                      | `^13.0.0`  |

## Installation

```sh
npm install @fullstory/guides-and-surveys-react-native
```

```sh
yarn add @fullstory/guides-and-surveys-react-native
```

## Usage

### Wrap your app with `GuidesAndSurveys`

`GuidesAndSurveys` must be placed **inside** your `NavigationContainer` and `GestureHandlerRootView`. It renders your app as children and overlays any active surveys on top.

```tsx
import { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GuidesAndSurveys } from '@fullstory/guides-and-surveys-react-native';

export default function App() {
  const navigationRef = useRef(null);

  return (
    <GestureHandlerRootView>
      <NavigationContainer ref={navigationRef}>
        <GuidesAndSurveys orgId="YOUR_ORG_ID" navigationRef={navigationRef}>
          <YourApp />
        </GuidesAndSurveys>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
```

### `GuidesAndSurveys` props

| Prop            | Type                                         | Required | Description                                                   |
| --------------- | -------------------------------------------- | -------- | ------------------------------------------------------------- |
| `orgId`         | `string`                                     | Yes      | Your FullStory org ID, used to fetch guides and surveys data. |
| `navigationRef` | `RefObject<NavigationContainerRef>`          | No       | React Navigation ref used for screen-based targeting.         |
| `tags`          | `{ userId?: string; [key: string]: string }` | No       | Visitor tags used for targeting and segmentation.             |
| `environment`   | `'production' \| 'staging' \| 'playpen'`     | No       | API environment to connect to. Defaults to `'production'`.    |

## Targeting Screens

Screen-based targeting uses React Navigation route names. Pass your `navigationRef` to `GuidesAndSurveys` and use the screen name as the value in the **URL contains** condition in the FullStory panel.

For screens that are the default child of a nested stack, specify both the parent and child screen names in the condition (joined with "or") to account for both navigation paths.

Requires React Navigation v6 or higher.

![How to target screens](./src/assets/images/targeting.png)

## License

MIT
