import type { ListComponent } from "@/types/distilled-content";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface ListRendererProps {
  data: ListComponent;
}

export function ListRenderer({ data }: ListRendererProps) {
  const isNumbered = data.listStyle === "numbered";
  const isFeatured = data.listStyle === "featured";

  return (
    <View style={sharedStyles.section}>
      {data.title && (
        <Text style={sharedStyles.sectionTitle}>{data.title}</Text>
      )}
      {data.description && (
        <Text style={sharedStyles.sectionDescription}>{data.description}</Text>
      )}

      <View style={styles.listContainer}>
        {data.items.map((item, index) => (
          <View
            key={`list-${index}`}
            style={[styles.listItem, isFeatured && styles.featuredItem]}
          >
            {/* Rank/Number Badge */}
            {(isNumbered || item.rank !== undefined) && (
              <View
                style={[styles.rankBadge, index === 0 && styles.rankBadgeFirst]}
              >
                <Text
                  style={[styles.rankText, index === 0 && styles.rankTextFirst]}
                >
                  {item.rank ?? index + 1}
                </Text>
              </View>
            )}

            {/* Bullet for bulleted style */}
            {!isNumbered && item.rank === undefined && !isFeatured && (
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>•</Text>
              </View>
            )}

            {/* Content */}
            <View style={styles.itemContent}>
              {/* Image (for featured style or if image exists) */}
              {item.image && isFeatured && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.textContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {item.tags.map((tag, tagIndex) => (
                      <View key={`tag-${tagIndex}`} style={sharedStyles.chip}>
                        <Text style={sharedStyles.chipText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    gap: SPACING.md,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  featuredItem: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    flexDirection: "column",
    gap: SPACING.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceHighlight,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  rankBadgeFirst: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  rankTextFirst: {
    color: COLORS.accent,
  },
  bulletContainer: {
    width: 24,
    alignItems: "center",
    paddingTop: 2,
  },
  bullet: {
    fontSize: 18,
    color: COLORS.accent,
  },
  itemContent: {
    flex: 1,
  },
  itemImage: {
    width: "100%",
    height: 160,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  textContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  itemDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
});
