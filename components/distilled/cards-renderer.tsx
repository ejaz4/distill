import type { CardsComponent } from "@/types/distilled-content";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import {
  BORDER_RADIUS,
  COLORS,
  SPACING,
  renderRatingStars,
  sharedStyles,
} from "./shared-styles";

interface CardsRendererProps {
  data: CardsComponent;
}

export function CardsRenderer({ data }: CardsRendererProps) {
  return (
    <View style={sharedStyles.section}>
      {data.title && (
        <Text style={sharedStyles.sectionTitle}>{data.title}</Text>
      )}
      {data.description && (
        <Text style={sharedStyles.sectionDescription}>{data.description}</Text>
      )}

      <View style={styles.cardsContainer}>
        {data.cards.map((card, index) => (
          <View key={`card-${index}`} style={styles.card}>
            {card.image ? (
              <ImageBackground
                source={{ uri: card.image }}
                style={styles.cardImage}
                imageStyle={styles.cardImageInner}
              >
                <View style={styles.imageOverlay}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  {card.subtitle && (
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  )}
                </View>
              </ImageBackground>
            ) : (
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                {card.subtitle && (
                  <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                )}
              </View>
            )}

            <View style={styles.cardContent}>
              {/* Rating & Price Row */}
              {(card.rating !== undefined || card.price) && (
                <View style={styles.metaRow}>
                  {card.rating !== undefined && (
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingStars}>
                        {renderRatingStars(card.rating)}
                      </Text>
                      <Text style={styles.ratingValue}>
                        {card.rating.toFixed(1)}
                      </Text>
                    </View>
                  )}
                  {card.price && <Text style={styles.price}>{card.price}</Text>}
                </View>
              )}

              {/* Summary */}
              {card.summary && (
                <Text style={styles.summary}>{card.summary}</Text>
              )}

              {/* Pros */}
              {card.pros && card.pros.length > 0 && (
                <View style={styles.prosConsContainer}>
                  <Text style={styles.prosTitle}>Pros</Text>
                  {card.pros.map((pro, i) => (
                    <View key={`pro-${i}`} style={styles.prosConsItem}>
                      <Text style={styles.prosIcon}>✓</Text>
                      <Text style={styles.prosConsText}>{pro}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Cons */}
              {card.cons && card.cons.length > 0 && (
                <View style={styles.prosConsContainer}>
                  <Text style={styles.consTitle}>Cons</Text>
                  {card.cons.map((con, i) => (
                    <View key={`con-${i}`} style={styles.prosConsItem}>
                      <Text style={styles.consIcon}>✗</Text>
                      <Text style={styles.prosConsText}>{con}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Specs */}
              {card.specs && Object.keys(card.specs).length > 0 && (
                <View style={styles.specsContainer}>
                  {Object.entries(card.specs).map(([key, value], i) => (
                    <View key={`spec-${i}`} style={styles.specItem}>
                      <Text style={styles.specLabel}>{key}</Text>
                      <Text style={styles.specValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {card.tags.map((tag, i) => (
                    <View key={`tag-${i}`} style={sharedStyles.chip}>
                      <Text style={sharedStyles.chipText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    gap: SPACING.lg,
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    justifyContent: "flex-end",
  },
  cardImageInner: {
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
  },
  imageOverlay: {
    padding: SPACING.lg,
    backgroundColor: COLORS.overlayLight,
  },
  cardHeader: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  cardContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  ratingStars: {
    color: COLORS.warning,
    fontSize: 14,
  },
  ratingValue: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.accent,
  },
  summary: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  prosConsContainer: {
    gap: SPACING.xs,
  },
  prosTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  consTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.danger,
    marginBottom: SPACING.xs,
  },
  prosConsItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  prosIcon: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: "600",
  },
  consIcon: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: "600",
  },
  prosConsText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  specsContainer: {
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  specItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  specLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  specValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
});
