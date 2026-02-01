import { ThemedText } from "@/components/themed-text";
import { useCards } from "@/hooks/use-cards";
import type { ContentItem } from "@/types/content";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const useExtractedContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  return { content, setContent };
};

const DistillPage = () => {
  const { url } = useLocalSearchParams<{ url: string }>();
  const webViewRef = useRef<WebView>(null);
  const { content, setContent } = useExtractedContent();
  const { cards, isLoading, error, resultsDescription } = useCards({
    content,
    endpoint: process.env.EXPO_PUBLIC_CARDS_ENDPOINT ?? "",
    contentKey: url,
  });

  useEffect(() => {
    console.log(resultsDescription);
  }, [resultsDescription]);

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
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {isLoading && <ThemedText>Generating cards…</ThemedText>}
        {!!error && <ThemedText>Failed: {error}</ThemedText>}
        {!isLoading && !error && cards.length === 0 && (
          <ThemedText>No cards yet.</ThemedText>
        )}
        {!!resultsDescription && (
          <ThemedText style={styles.resultsDescription}>
            {resultsDescription}
          </ThemedText>
        )}
        <ThemedText>Distilling: {url}</ThemedText>
        {cards.map((card, index) => (
          <View key={`${card.name}-${index}`} style={styles.card}>
            {card.image ? (
              <ImageBackground
                source={{ uri: card.image }}
                style={styles.cardImage}
                imageStyle={styles.cardImageInner}
              >
                <View style={styles.imageOverlay}>
                  <ThemedText style={styles.cardTitle}>{card.name}</ThemedText>
                  {!!card.shortDescription && (
                    <ThemedText style={styles.cardDescription}>
                      {card.shortDescription}
                    </ThemedText>
                  )}
                  {!!card.fields?.length && (
                    <View style={styles.chipsContainer}>
                      {card.fields.map((field, fieldIndex) => (
                        <View
                          key={`${field.label}-${fieldIndex}`}
                          style={styles.chip}
                        >
                          <ThemedText style={styles.chipLabel}>
                            {field.value}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ImageBackground>
            ) : (
              <View style={[styles.cardImage, styles.cardImageFallback]}>
                <ThemedText style={styles.cardTitle}>{card.name}</ThemedText>
                {!!card.shortDescription && (
                  <ThemedText style={styles.cardDescription}>
                    {card.shortDescription}
                  </ThemedText>
                )}
                {!!card.fields?.length && (
                  <View style={styles.chipsContainer}>
                    {card.fields.map((field, fieldIndex) => (
                      <View
                        key={`${field.label}-${fieldIndex}`}
                        style={styles.chip}
                      >
                        <ThemedText style={styles.chipLabel}>
                          {field.value}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {!!card.buttons?.length && (
              <View style={styles.buttonsContainer}>
                {card.buttons.map((button, buttonIndex) => (
                  <Pressable
                    key={`${button.label}-${buttonIndex}`}
                    style={styles.button}
                    onPress={() => {
                      Linking.openURL(button.url).catch((err) =>
                        console.error("Failed to open url", err),
                      );
                    }}
                  >
                    <ThemedText style={styles.buttonLabel}>
                      {button.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

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
            } catch (error) {
              console.error("Error parsing extracted content:", error);
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
    // padding: 16,
  },
  cardsContainer: {
    paddingVertical: 12,
    gap: 12,
  },
  resultsDescription: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    minHeight: 200,
    justifyContent: "flex-end",
  },
  cardImageInner: {
    borderRadius: 16,
  },
  cardImageFallback: {
    padding: 16,
  },
  imageOverlay: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  cardDescription: {
    opacity: 0.9,
    color: "#fff",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  chipLabel: {
    fontSize: 12,
    color: "#fff",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
    paddingTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttonLabel: {
    fontSize: 14,
  },
  hiddenWebView: {
    opacity: 0,
    height: 0,
    width: 0,
  },
});

export default DistillPage;
