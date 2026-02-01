import type {
  DistilledComponent,
  DistilledResponse,
} from "@/types/distilled-content";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ArticleRenderer } from "./article-renderer";
import { CardsRenderer } from "./cards-renderer";
import { ComparisonRenderer } from "./comparison-renderer";
import { FaqRenderer } from "./faq-renderer";
import { GalleryRenderer } from "./gallery-renderer";
import { HeroRenderer } from "./hero-renderer";
import { ListRenderer } from "./list-renderer";
import { ProfileRenderer } from "./profile-renderer";
import { QuoteRenderer } from "./quote-renderer";
import { COLORS, SPACING } from "./shared-styles";
import { StatsRenderer } from "./stats-renderer";
import { TimelineRenderer } from "./timeline-renderer";

interface DistilledContentRendererProps {
  data: DistilledResponse;
}

/**
 * Renders a single distilled component based on its type.
 * Falls back to an error message for unrecognized types.
 */
function ComponentRenderer({
  component,
  index,
}: {
  component: DistilledComponent;
  index: number;
}) {
  switch (component.type) {
    case "cards":
      return <CardsRenderer data={component} />;
    case "article":
      return <ArticleRenderer data={component} />;
    case "timeline":
      return <TimelineRenderer data={component} />;
    case "comparison":
      return <ComparisonRenderer data={component} />;
    case "faq":
      return <FaqRenderer data={component} />;
    case "stats":
      return <StatsRenderer data={component} />;
    case "hero":
      return <HeroRenderer data={component} />;
    case "list":
      return <ListRenderer data={component} />;
    case "gallery":
      return <GalleryRenderer data={component} />;
    case "profile":
      return <ProfileRenderer data={component} />;
    case "quote":
      return <QuoteRenderer data={component} />;
    default:
      // Fallback for unrecognized types
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Unknown component type: {(component as { type: string }).type}
          </Text>
        </View>
      );
  }
}

/**
 * Main renderer that iterates through all components in the distilled response.
 * Renders components top to bottom in the order specified.
 */
export function DistilledContentRenderer({
  data,
}: DistilledContentRendererProps) {
  if (!data.components || data.components.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No content to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.components.map((component, index) => (
        <ComponentRenderer
          key={`component-${index}-${component.type}`}
          component={component}
          index={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xl,
  },
  errorContainer: {
    backgroundColor: "rgba(255,69,58,0.1)",
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "rgba(255,69,58,0.3)",
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
});

// Re-export individual renderers for flexibility
export { ArticleRenderer } from "./article-renderer";
export { CardsRenderer } from "./cards-renderer";
export { ComparisonRenderer } from "./comparison-renderer";
export { FaqRenderer } from "./faq-renderer";
export { GalleryRenderer } from "./gallery-renderer";
export { HeroRenderer } from "./hero-renderer";
export { ListRenderer } from "./list-renderer";
export { ProfileRenderer } from "./profile-renderer";
export { QuoteRenderer } from "./quote-renderer";
export { StatsRenderer } from "./stats-renderer";
export { TimelineRenderer } from "./timeline-renderer";
