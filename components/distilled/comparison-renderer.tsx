import type { ComparisonComponent } from "@/types/distilled-content";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface ComparisonRendererProps {
  data: ComparisonComponent;
}

export function ComparisonRenderer({ data }: ComparisonRendererProps) {
  const columnCount = data.items.length;

  return (
    <View style={sharedStyles.section}>
      {data.title && (
        <Text style={sharedStyles.sectionTitle}>{data.title}</Text>
      )}
      {data.description && (
        <Text style={sharedStyles.sectionDescription}>{data.description}</Text>
      )}

      <View style={styles.tableContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={styles.categoryCell}>
                <Text style={styles.categoryHeaderText}>Feature</Text>
              </View>
              {data.items.map((item, index) => (
                <View key={`header-${index}`} style={styles.valueCell}>
                  <Text style={styles.headerText} numberOfLines={2}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            {/* Data Rows */}
            {data.categories.map((category, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                style={[
                  styles.dataRow,
                  rowIndex % 2 === 1 && styles.alternateRow,
                ]}
              >
                <View style={styles.categoryCell}>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
                {category.values.map((value, colIndex) => (
                  <View
                    key={`cell-${rowIndex}-${colIndex}`}
                    style={[
                      styles.valueCell,
                      category.highlight === colIndex && styles.highlightCell,
                    ]}
                  >
                    <Text
                      style={[
                        styles.valueText,
                        category.highlight === colIndex && styles.highlightText,
                      ]}
                    >
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  table: {
    minWidth: "100%",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceHighlight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  alternateRow: {
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  categoryCell: {
    width: 100,
    padding: SPACING.md,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  categoryHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  valueCell: {
    width: 110,
    padding: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  headerText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  valueText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  highlightCell: {
    backgroundColor: COLORS.successSoft,
  },
  highlightText: {
    color: COLORS.success,
    fontWeight: "600",
  },
});
