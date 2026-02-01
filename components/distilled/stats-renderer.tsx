import type { StatsComponent } from "@/types/distilled-content";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BORDER_RADIUS,
  COLORS,
  SPACING,
  getIconEmoji,
  getTrendColor,
  getTrendIcon,
  sharedStyles,
} from "./shared-styles";

interface StatsRendererProps {
  data: StatsComponent;
}

export function StatsRenderer({ data }: StatsRendererProps) {
  return (
    <View style={sharedStyles.section}>
      {data.title && (
        <Text style={sharedStyles.sectionTitle}>{data.title}</Text>
      )}
      {data.summary && (
        <Text style={sharedStyles.sectionDescription}>{data.summary}</Text>
      )}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {data.stats.map((stat, index) => (
          <View key={`stat-${index}`} style={styles.statCard}>
            {/* Icon */}
            {stat.icon && (
              <Text style={styles.statIcon}>{getIconEmoji(stat.icon)}</Text>
            )}

            {/* Value with trend */}
            <View style={styles.valueRow}>
              <Text style={styles.statValue}>{stat.value}</Text>
              {stat.trend && (
                <Text
                  style={[
                    styles.trendIcon,
                    { color: getTrendColor(stat.trend) },
                  ]}
                >
                  {getTrendIcon(stat.trend)}
                </Text>
              )}
            </View>

            {/* Label */}
            <Text style={styles.statLabel}>{stat.label}</Text>

            {/* Context */}
            {stat.context && (
              <Text style={styles.statContext}>{stat.context}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Charts placeholder - would need a charting library for full implementation */}
      {data.charts && data.charts.length > 0 && (
        <View style={styles.chartsContainer}>
          {data.charts.map((chart, index) => (
            <View key={`chart-${index}`} style={styles.chartPlaceholder}>
              <Text style={styles.chartTitle}>{chart.title}</Text>
              <Text style={styles.chartType}>
                📊 {chart.type.toUpperCase()} Chart
              </Text>
              <Text style={styles.chartNote}>
                (Chart visualization would render here)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  trendIcon: {
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  statContext: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  chartsContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  chartPlaceholder: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: "center",
    minHeight: 150,
    justifyContent: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  chartType: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chartNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontStyle: "italic",
  },
});
