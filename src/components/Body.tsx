import { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { useStore } from '../stores/useStore';
import { diagonalScale, webViewFontHandler } from '../constants';

type BodyProps = {
  content: string;
};

const injectedJavaScript = `
(function() {
    function getContentHeight() {
      const body = document.body;
      return body.offsetHeight;
    }
    const height = getContentHeight();
   
    window.ReactNativeWebView.postMessage(height.toString());
  })();
`;

export const Body = ({ content }: BodyProps) => {
  const [webViewHeight, setWebViewHeight] = useState(0);
  const webviewRef = useRef(null);

  const theme = useStore((s) => s.theme);

  const fontSize = (theme.fontSize / 3) * webViewFontHandler();

  const bodyCss = `<style>
    body{
    margin:3px 0;
    padding:0;
    font-size:${fontSize}px;
    }
    *{
    background-color: ${theme.bgColor};
    color: ${theme.fontColor};
    }
    p{
    font-size:${fontSize}px;
    line-height:1.4;
    font-family: sans-serif;
    }
    </style>`;

  const body = useMemo(() => {
    return `<body>${content}${bodyCss}</body>`;
  }, [bodyCss, content]);

  return (
    <View style={{ height: Math.min(webViewHeight * diagonalScale, 200) }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: body }}
        injectedJavaScript={injectedJavaScript}
        onMessage={(event) => {
          setWebViewHeight(Number(event.nativeEvent.data) + 20);
        }}
        style={{ backgroundColor: theme.bgColor }}
      />
    </View>
  );
};
