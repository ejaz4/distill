import { ThemedText } from "@/components/themed-text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

type ContentItem =
  | { type: "text"; content: string }
  | { type: "image"; src: string };

const usePageContent = () => {
  const [pageContent, setPageContent] = useState<ContentItem[]>([]);
  return { pageContent, setPageContent };
};

// Checks the validity of the share sheet.
const DistillProcessPage = () => {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();
  const webViewRef = useRef<WebView>(null);
  const { pageContent, setPageContent } = usePageContent();

  useEffect(() => {
    // This will run whenever pageContent changes
    console.log("Page content changed");
  }, [pageContent]);

  const extractContent = () => {
    if (webViewRef.current) {
      const injectedJS = `
        (function() {
          // Try to find reader mode content
          let container = null;
          
          // Look for common article containers
          const article = document.querySelector('article') || 
                         document.querySelector('main') ||
                         document.querySelector('[role="main"]') ||
                         document.querySelector('.article-content') ||
                         document.querySelector('.post-content') ||
                         document.querySelector('.entry-content');
          
          container = article || document.body;
          
          // Extract content preserving inline images
          const contentArray = [];
          let currentText = '';
          
          function traverse(node) {
            for (let child of node.childNodes) {
              if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent.trim();
                if (text) {
                  currentText += text + ' ';
                }
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === 'IMG') {
                  // Save current text if any
                  if (currentText.trim()) {
                    contentArray.push({ type: 'text', content: currentText.trim() });
                    currentText = '';
                  }
                  // Add image
                  const src = child.src || child.getAttribute('data-src');
                  if (src) {
                    const absoluteUrl = new URL(src, window.location.href).href;
                    contentArray.push({ type: 'image', src: absoluteUrl });
                  }
                } else if (!['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(child.tagName)) {
                  traverse(child);
                }
              }
            }
          }
          
          traverse(container);
          
          // Save any remaining text
          if (currentText.trim()) {
            contentArray.push({ type: 'text', content: currentText.trim() });
          }
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pageContent',
            content: contentArray,
            title: document.title,
            imageCount: contentArray.filter(item => item.type === 'image').length
          }));
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(injectedJS);
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "pageContent") {
        setPageContent(data.content);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={{ display: "none" }}
        onLoadEnd={extractContent}
        onMessage={handleWebViewMessage}
      />
      <ThemedText>{url}</ThemedText>
    </View>
  );
};

export default DistillProcessPage;
