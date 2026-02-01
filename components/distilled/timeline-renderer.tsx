import type { TimelineComponent } from "@/types/distilled-content";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface TimelineRendererProps {
  data: TimelineComponent;
}

export function TimelineRenderer({ data }: TimelineRendererProps) {
  return (
    <View style={sharedStyles.section}>
      {data.title && (
        <Text style={sharedStyles.sectionTitle}>{data.title}</Text>
      )}
      {data.description && (
        <Text style={sharedStyles.sectionDescription}>{data.description}</Text>
      )}

      <View style={styles.timeline}>
        {data.items.map((item, index) => (
          <View key={`timeline-${index}`} style={styles.timelineItem}>
            {/* Left side - date/icon */}
            <View style={styles.timelineLeft}>
              {item.icon && (
                <Text style={styles.timelineIcon}>{item.icon}</Text>
              )}
              {item.date && (
                <Text style={styles.timelineDate}>{item.date}</Text>
              )}
            </View>

            {/* Center - line and dot */}
            <View style={styles.timelineCenter}>
              <View style={styles.dot} />
              {index < data.items.length - 1 && <View style={styles.line} />}
            </View>

            {/* Right side - content */}
            <View style={styles.timelineRight}>
              <View style={styles.timelineCard}>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.timelineImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.timelineDescription}>
                      {item.description}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 100,
  },
  timelineLeft: {
    width: 60,
    alignItems: "center",
    paddingTop: SPACING.sm,
  },
  timelineIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
    textAlign: "center",
  },
  timelineCenter: {
    width: 24,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.accentSoft,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  timelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  timelineImage: {
    width: "100%",
    height: 120,
  },
  timelineContent: {
    padding: SPACING.md,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  timelineDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
