import { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

type BodyProps = {
  content: string;
};

export const Body = ({ content }: BodyProps) => {
  const [webViewHeight, setWebViewHeight] = useState(0);
  const webviewRef = useRef(null);

  const injectedJavaScript = `
      (function() {
        const height = document.documentElement.scrollHeight;
        window.ReactNativeWebView.postMessage(height.toString());
      })();
    `;

  const body = useMemo(() => {
    return `${content}${bodyCss}`;
  }, [content]);

  return (
    <View style={{ height: webViewHeight / 4 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: body }}
        injectedJavaScript={injectedJavaScript}
        onMessage={(event) => {
          setWebViewHeight(Number(event.nativeEvent.data));
        }}
      />
    </View>
  );
};

const bodyCss = `<style>
p{
font-size:36px;
font-family: sans-serif;
}
</style>`;
