import type { GalleryComponent } from "@/types/distilled-content";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface GalleryRendererProps {
  data: GalleryComponent;
}

const { width: screenWidth } = Dimensions.get("window");
const GALLERY_ITEM_WIDTH = screenWidth - 64; // Account for padding

export function GalleryRenderer({ data }: GalleryRendererProps) {
  const isCarousel = data.layout === "carousel";
  const isGrid = data.layout === "grid" || !data.layout;

  return (
    <View style={sharedStyles.section}>
      {data.title && (
        <Text style={sharedStyles.sectionTitle}>{data.title}</Text>
      )}
      {data.description && (
        <Text style={sharedStyles.sectionDescription}>{data.description}</Text>
      )}

      {isCarousel ? (
        // Carousel Layout
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={GALLERY_ITEM_WIDTH + SPACING.md}
          contentContainerStyle={styles.carouselContainer}
        >
          {data.images.map((image, index) => (
            <View key={`gallery-${index}`} style={styles.carouselItem}>
              <Image
                source={{ uri: image.url }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
              {(image.caption || image.credit) && (
                <View style={styles.captionContainer}>
                  {image.caption && (
                    <Text style={styles.caption}>{image.caption}</Text>
                  )}
                  {image.credit && (
                    <Text style={styles.credit}>{image.credit}</Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        // Grid/Masonry Layout
        <View style={styles.gridContainer}>
          {data.images.map((image, index) => (
            <View
              key={`gallery-${index}`}
              style={[
                styles.gridItem,
                // Alternate sizes for masonry effect
                data.layout === "masonry" &&
                  index % 3 === 0 &&
                  styles.gridItemLarge,
              ]}
            >
              <Image
                source={{ uri: image.url }}
                style={styles.gridImage}
                resizeMode="cover"
              />
              <View style={styles.gridOverlay}>
                {image.caption && (
                  <Text style={styles.gridCaption} numberOfLines={2}>
                    {image.caption}
                  </Text>
                )}
              </View>

              {/* Tags */}
              {image.tags && image.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {image.tags.slice(0, 2).map((tag, tagIndex) => (
                    <View key={`tag-${tagIndex}`} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Carousel Styles
  carouselContainer: {
    gap: SPACING.md,
  },
  carouselItem: {
    width: GALLERY_ITEM_WIDTH,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: 240,
  },
  captionContainer: {
    padding: SPACING.lg,
  },
  caption: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  credit: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },

  // Grid Styles
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  gridItem: {
    width: "48.5%",
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  gridItemLarge: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  gridCaption: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  tagsContainer: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: "row",
    gap: SPACING.xs,
  },
  tag: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
});
