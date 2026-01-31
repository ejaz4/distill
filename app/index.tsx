import { ShareGuideGlyph } from "@/assets/images/svg/share-guide-glyph";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect } from "react";
import { View } from "react-native";

// Checks the validity of the share sheet.
const ShareCheckerPage = () => {
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent, error } =
    useShareIntentContext();

  useEffect(() => {
    if (hasShareIntent && shareIntent?.webUrl) {
      try {
        new URL(shareIntent.webUrl);
        router.push({
          pathname: "/distill",
          params: { url: shareIntent.webUrl },
        });
      } catch {
        // Invalid URL, don't navigate
      }
    }
  }, [hasShareIntent, shareIntent, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!hasShareIntent ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 32,
          }}
        >
          <ShareGuideGlyph />
          <ThemedText style={{ textAlign: "center" }}>
            Tap Share and select Distill to begin distilling sites and text.
          </ThemedText>
        </View>
      ) : (
        <>
          <ThemedText>hasShareIntent: {hasShareIntent.toString()}</ThemedText>
          <ThemedText>shareIntentUrl: {shareIntent.webUrl}</ThemedText>
          <ThemedText>shareIntentText: {shareIntent.text}</ThemedText>
        </>
      )}
    </View>
  );
};

export default ShareCheckerPage;
