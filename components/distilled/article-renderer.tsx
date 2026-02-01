import type { ArticleComponent } from "@/types/distilled-content";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface ArticleRendererProps {
  data: ArticleComponent;
}

// Simple markdown-like rendering for article content
function renderMarkdownContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        elements.push(
          <Text key={`p-${elements.length}`} style={styles.paragraph}>
            {text}
          </Text>,
        );
      }
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line - flush paragraph
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      flushParagraph();
      elements.push(
        <Text key={`h3-${i}`} style={styles.h3}>
          {trimmed.slice(4)}
        </Text>,
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      elements.push(
        <Text key={`h2-${i}`} style={styles.h2}>
          {trimmed.slice(3)}
        </Text>,
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      elements.push(
        <Text key={`h1-${i}`} style={styles.h1}>
          {trimmed.slice(2)}
        </Text>,
      );
      continue;
    }

    // Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph();
      elements.push(
        <View key={`bullet-${i}`} style={styles.bulletItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>{trimmed.slice(2)}</Text>
        </View>,
      );
      continue;
    }

    // Images in markdown format ![alt](url)
    const imageMatch = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      flushParagraph();
      const [, alt, url] = imageMatch;
      elements.push(
        <View key={`img-${i}`} style={styles.imageContainer}>
          <Image
            source={{ uri: url }}
            style={styles.contentImage}
            resizeMode="cover"
          />
          {alt && <Text style={styles.imageCaption}>{alt}</Text>}
        </View>,
      );
      continue;
    }

    // Regular text - add to paragraph
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  return elements;
}

export function ArticleRenderer({ data }: ArticleRendererProps) {
  return (
    <View style={sharedStyles.section}>
      {/* Hero Image */}
      {data.heroImage && (
        <Image
          source={{ uri: data.heroImage }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        {data.subtitle && <Text style={styles.subtitle}>{data.subtitle}</Text>}

        {/* Meta info */}
        {(data.author || data.readTime) && (
          <View style={styles.metaRow}>
            {data.author && <Text style={styles.author}>By {data.author}</Text>}
            {data.author && data.readTime && (
              <Text style={styles.metaSeparator}>•</Text>
            )}
            {data.readTime && (
              <Text style={styles.readTime}>{data.readTime}</Text>
            )}
          </View>
        )}
      </View>

      {/* Key Takeaways */}
      {data.keyTakeaways && data.keyTakeaways.length > 0 && (
        <View style={styles.takeawaysContainer}>
          <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
          {data.keyTakeaways.map((takeaway, index) => (
            <View key={`takeaway-${index}`} style={styles.takeawayItem}>
              <Text style={styles.takeawayIcon}>→</Text>
              <Text style={styles.takeawayText}>{takeaway}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>{renderMarkdownContent(data.content)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: "100%",
    height: 220,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  author: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  metaSeparator: {
    color: COLORS.textMuted,
  },
  readTime: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  takeawaysContainer: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  takeawaysTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.accent,
    marginBottom: SPACING.md,
  },
  takeawayItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  takeawayIcon: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  takeawayText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  content: {
    gap: SPACING.md,
  },
  h1: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  paragraph: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 26,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    paddingLeft: SPACING.sm,
  },
  bulletPoint: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  imageContainer: {
    marginVertical: SPACING.md,
  },
  contentImage: {
    width: "100%",
    height: 200,
    borderRadius: BORDER_RADIUS.md,
  },
  imageCaption: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.sm,
    fontStyle: "italic",
  },
});
