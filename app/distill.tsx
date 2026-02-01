import { DistilledContentRenderer } from "@/components/distilled";
import { ThemedText } from "@/components/themed-text";
import { useDistillation, type ContentItem } from "@/hooks/use-distillation";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const useExtractedContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  return { content, setContent };
};

const DistillPage = () => {
  const { url } = useLocalSearchParams<{ url: string }>();
  const webViewRef = useRef<WebView>(null);
  const { content, setContent } = useExtractedContent();
  const { distilledContent, isLoading, error } = useDistillation({
    content,
    endpoint: process.env.EXPO_PUBLIC_CARDS_ENDPOINT ?? "",
    contentKey: url,
  });

  const extractionScript = `
    (function() {
      function isLikelyNoiseElement(el) {
        const tagName = el.tagName ? el.tagName.toLowerCase() : '';
        if (['script', 'style', 'noscript', 'iframe', 'svg', 'nav', 'footer', 'header', 'aside', 'form', 'button', 'input', 'select', 'textarea'].includes(tagName)) {
          return true;
        }
        const id = (el.id || '').toLowerCase();
        const className = (el.className || '').toString().toLowerCase();
        const noiseTokens = ['ad', 'ads', 'advert', 'promo', 'cookie', 'banner', 'subscribe', 'newsletter', 'share', 'social', 'sidebar', 'footer', 'header', 'nav'];
        return noiseTokens.some(token => id.includes(token) || className.includes(token));
      }

      function pickMainContainer() {
        const candidates = Array.from(document.querySelectorAll('main, article, [role="main"], #content, .content, .article, .post, .entry-content'));
        const filtered = candidates.filter(el => !isLikelyNoiseElement(el));
        const pool = filtered.length > 0 ? filtered : [document.body];
        let best = pool[0] || document.body;
        let bestScore = 0;
        for (const el of pool) {
          const text = (el.innerText || '').trim();
          const score = text.length;
          if (score > bestScore) {
            bestScore = score;
            best = el;
          }
        }
        return best;
      }

      function extractContent(root) {
        const content = [];
        let textBuffer = '';

        function flushText() {
          const text = textBuffer.trim();
          if (text) {
            content.push({ type: 'text', content: text });
          }
          textBuffer = '';
        }

        function appendText(text) {
          if (!text) return;
          if (textBuffer.length > 0) {
            textBuffer += ' ';
          }
          textBuffer += text;
        }

        function traverse(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();

            if (isLikelyNoiseElement(node)) {
              return;
            }

            if (['h1','h2','h3','h4','h5','h6'].includes(tagName)) {
              flushText();
              const titleText = node.textContent?.trim();
              if (titleText) {
                content.push({ type: 'text', content: titleText });
              }
              return;
            }

            if (tagName === 'img') {
              flushText();
              const src = node.getAttribute('src') || node.getAttribute('data-src') || node.getAttribute('srcset');
              if (src) {
                content.push({ type: 'image', src: src });
              }
              return;
            }

            if (node.childNodes.length === 0) {
              const text = node.textContent?.trim();
              if (text) {
                appendText(text);
              }
            } else {
              for (let child of node.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                  const text = child.textContent?.trim();
                  if (text) {
                    appendText(text);
                  }
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                  traverse(child);
                }
              }
            }
          }
        }

        traverse(root);
        flushText();
        return content;
      }

      const main = pickMainContainer();
      const extracted = extractContent(main);
      window.ReactNativeWebView.postMessage(JSON.stringify(extracted));
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>
              Distilling content…
            </ThemedText>
            <ThemedText style={styles.loadingUrl} numberOfLines={1}>
              {url}
            </ThemedText>
          </View>
        )}

        {/* Error State */}
        {!!error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorTitle}>
              Distillation Failed
            </ThemedText>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !error && !distilledContent && (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Preparing to distill…
            </ThemedText>
          </View>
        )}

        {/* Distilled Content */}
        {distilledContent && distilledContent.components.length > 0 && (
          <DistilledContentRenderer data={distilledContent} />
        )}

        {/* Source indicator */}
        {distilledContent && (
          <View style={styles.sourceContainer}>
            <ThemedText style={styles.sourceLabel}>Distilled from</ThemedText>
            <ThemedText style={styles.sourceUrl} numberOfLines={1}>
              {url}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Hidden WebView for content extraction */}
      {url && (
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.hiddenWebView}
          onLoadEnd={() => {
            console.log("WebView loaded, extracting content...");
            webViewRef.current?.injectJavaScript(extractionScript);
          }}
          onMessage={(event) => {
            try {
              const extractedContent = JSON.parse(event.nativeEvent.data);
              setContent(extractedContent);
            } catch (parseError) {
              console.error("Error parsing extracted content:", parseError);
            }
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error: ", nativeEvent);
          }}
          javaScriptEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    // paddingHorizontal: 16,
    paddingBottom: 48,
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  loadingUrl: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    maxWidth: "80%",
  },
  errorContainer: {
    backgroundColor: "rgba(255,69,58,0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,69,58,0.3)",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF453A",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
  },
  sourceContainer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    gap: 4,
  },
  sourceLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sourceUrl: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    maxWidth: "90%",
  },
  hiddenWebView: {
    opacity: 0,
    height: 0,
    width: 0,
  },
});

export default DistillPage;
