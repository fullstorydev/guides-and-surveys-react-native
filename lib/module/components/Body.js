"use strict";

import { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { useStore } from "../stores/useStore.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const Body = ({
  content
}) => {
  const [webViewHeight, setWebViewHeight] = useState(0);
  const webviewRef = useRef(null);
  const theme = useStore(s => s.theme);
  const injectedJavaScript = `
      (function() {
        const height = document.documentElement.scrollHeight;
        window.ReactNativeWebView.postMessage(height.toString());
      })();
    `;
  const bodyCss = `<style>
    *{
    background-color: ${theme.bgColor};
    color: ${theme.fontColor};
    }
    p{
    font-size:${theme.fontSize + 16}px;
    line-height:1.4;
    font-family: sans-serif;
    }
    </style>`;
  const body = useMemo(() => {
    return `${content}${bodyCss}`;
  }, [bodyCss, content]);
  return /*#__PURE__*/_jsx(View, {
    style: {
      height: webViewHeight / 4
    },
    children: /*#__PURE__*/_jsx(WebView, {
      ref: webviewRef,
      originWhitelist: ['*'],
      source: {
        html: body
      },
      injectedJavaScript: injectedJavaScript,
      onMessage: event => {
        setWebViewHeight(Number(event.nativeEvent.data));
      },
      style: {
        backgroundColor: theme.bgColor
      }
    })
  });
};
//# sourceMappingURL=Body.js.map