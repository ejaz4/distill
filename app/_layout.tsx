import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { DistillWordMark } from "@/assets/images/svg/distill-wordmark";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ShareIntentProvider } from "expo-share-intent";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ShareIntentProvider>
      <ThemeProvider value={DarkTheme}>
        <SafeAreaView
          style={{
            flex: 1,
            padding: 32,
            backgroundColor: "#000",
          }}
        >
          <DistillWordMark />
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
  );
}
