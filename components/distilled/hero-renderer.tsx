import type { HeroComponent } from "@/types/distilled-content";
import React from "react";
import {
  ImageBackground,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface HeroRendererProps {
  data: HeroComponent;
}

export function HeroRenderer({ data }: HeroRendererProps) {
  const handleCTAPress = () => {
    if (data.cta?.url) {
      Linking.openURL(data.cta.url).catch(console.error);
    }
  };

  return (
    <View style={sharedStyles.section}>
      {data.heroImage ? (
        <ImageBackground
          source={{ uri: data.heroImage }}
          style={styles.heroWithImage}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.headline}>{data.headline}</Text>
            {data.subheadline && (
              <Text style={styles.subheadline}>{data.subheadline}</Text>
            )}
            {data.cta && (
              <Pressable style={styles.ctaButton} onPress={handleCTAPress}>
                <Text style={styles.ctaText}>{data.cta.text}</Text>
              </Pressable>
            )}
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.heroWithoutImage}>
          <Text style={styles.headline}>{data.headline}</Text>
          {data.subheadline && (
            <Text style={styles.subheadline}>{data.subheadline}</Text>
          )}
          {data.cta && (
            <Pressable style={styles.ctaButton} onPress={handleCTAPress}>
              <Text style={styles.ctaText}>{data.cta.text}</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Highlights */}
      {data.highlights && data.highlights.length > 0 && (
        <View style={styles.highlightsContainer}>
          {data.highlights.map((highlight, index) => (
            <View key={`highlight-${index}`} style={styles.highlightCard}>
              {highlight.icon && (
                <Text style={styles.highlightIcon}>{highlight.icon}</Text>
              )}
              <Text style={styles.highlightTitle}>{highlight.title}</Text>
              <Text style={styles.highlightDescription}>
                {highlight.description}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Summary */}
      {data.summary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroWithImage: {
    minHeight: 280,
    justifyContent: "flex-end",
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.lg,
  },
  heroImageStyle: {
    borderRadius: BORDER_RADIUS.lg,
  },
  heroOverlay: {
    padding: SPACING.xl,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  heroWithoutImage: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  headline: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 40,
  },
  subheadline: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    lineHeight: 26,
  },
  ctaButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: "flex-start",
    marginTop: SPACING.lg,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  highlightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  highlightCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: "center",
  },
  highlightIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  highlightDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  summaryContainer: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summary: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 26,
  },
});
