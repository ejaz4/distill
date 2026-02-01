import type { QuoteComponent } from "@/types/distilled-content";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface QuoteRendererProps {
  data: QuoteComponent;
}

export function QuoteRenderer({ data }: QuoteRendererProps) {
  const content = (
    <View style={styles.quoteContent}>
      {/* Quote marks */}
      <Text style={styles.quoteMarks}>"</Text>

      {/* Quote text */}
      <Text style={styles.quoteText}>{data.quote}</Text>

      {/* Author section */}
      <View style={styles.authorSection}>
        {data.image && (
          <Image
            source={{ uri: data.image }}
            style={styles.authorImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.authorInfo}>
          {data.author && (
            <Text style={styles.authorName}>— {data.author}</Text>
          )}
          {data.context && (
            <Text style={styles.authorContext}>{data.context}</Text>
          )}
        </View>
      </View>

      {/* Related content */}
      {data.relatedContent && (
        <View style={styles.relatedContainer}>
          <Text style={styles.relatedContent}>{data.relatedContent}</Text>
        </View>
      )}
    </View>
  );

  if (data.backgroundImage) {
    return (
      <View style={sharedStyles.section}>
        <ImageBackground
          source={{ uri: data.backgroundImage }}
          style={styles.backgroundContainer}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.overlay}>{content}</View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={sharedStyles.section}>
      <View style={styles.quoteCard}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  quoteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  backgroundContainer: {
    minHeight: 300,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
  backgroundImage: {
    borderRadius: BORDER_RADIUS.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
  },
  quoteContent: {
    padding: SPACING.xl,
  },
  quoteMarks: {
    fontSize: 64,
    lineHeight: 64,
    color: COLORS.accent,
    fontWeight: "700",
    marginBottom: -SPACING.lg,
    marginLeft: -SPACING.sm,
  },
  quoteText: {
    fontSize: 24,
    fontWeight: "500",
    color: COLORS.textPrimary,
    lineHeight: 36,
    fontStyle: "italic",
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  authorContext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  relatedContainer: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  relatedContent: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});
