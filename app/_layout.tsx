import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import { Pressable, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { DistillWordMark } from "@/assets/images/svg/distill-wordmark";
import { HistoryProvider } from "@/contexts/history-context";
import { ShareProvider, useShareContext } from "@/contexts/share-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { shareDistilledContent } from "@/services/share";
import { ShareIntentProvider } from "expo-share-intent";

export const unstable_settings = {
  anchor: "(tabs)",
};

function HeaderBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { shareableContent, sourceUrl } = useShareContext();

  const isDistillPage = pathname === "/distill";
  const canShare = isDistillPage && shareableContent !== null;

  const handleLogoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleShare = async () => {
    if (shareableContent && sourceUrl) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      try {
        await shareDistilledContent(shareableContent, sourceUrl);
      } catch (error) {
        console.error("Failed to share:", error);
      }
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Pressable
        onPress={handleLogoPress}
        style={({ pressed }) => [
          styles.logoButton,
          pressed && styles.logoButtonPressed,
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <DistillWordMark />
      </Pressable>

      {canShare && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 300 }}
        >
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.shareButton,
              pressed && styles.shareButtonPressed,
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.shareIcon}>↗</Text>
          </Pressable>
        </MotiView>
      )}
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <HistoryProvider>
      <ShareProvider>
        <ShareIntentProvider>
          <ThemeProvider value={DarkTheme}>
            <SafeAreaView
              style={{
                flex: 1,
                padding: 32,
                backgroundColor: "#000",
              }}
            >
              <HeaderBar />
              <Stack
                screenOptions={{
                  statusBarStyle: "light",
                  headerShown: false,
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal", title: "Modal" }}
                />
              </Stack>
            </SafeAreaView>
            <StatusBar style="auto" />
          </ThemeProvider>
        </ShareIntentProvider>
      </ShareProvider>
    </HistoryProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  logoButton: {
    opacity: 1,
  },
  logoButtonPressed: {
    opacity: 0.6,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(10,132,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonPressed: {
    backgroundColor: "rgba(10,132,255,0.25)",
    transform: [{ scale: 0.95 }],
  },
  shareIcon: {
    fontSize: 18,
    color: "#0A84FF",
    fontWeight: "600",
  },
});
