import type { ProfileComponent } from "@/types/distilled-content";
import React from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface ProfileRendererProps {
  data: ProfileComponent;
}

const SOCIAL_ICONS: Record<string, string> = {
  twitter: "𝕏",
  linkedin: "in",
  github: "⌨",
  website: "🌐",
};

export function ProfileRenderer({ data }: ProfileRendererProps) {
  const handleSocialPress = (platform: string, handle?: string) => {
    if (!handle) return;

    let url = handle;
    if (!handle.startsWith("http")) {
      switch (platform) {
        case "twitter":
          url = `https://twitter.com/${handle.replace("@", "")}`;
          break;
        case "linkedin":
          url = `https://linkedin.com/in/${handle}`;
          break;
        case "github":
          url = `https://github.com/${handle}`;
          break;
        case "website":
          url = handle.startsWith("http") ? handle : `https://${handle}`;
          break;
      }
    }

    Linking.openURL(url).catch(console.error);
  };

  return (
    <View style={sharedStyles.section}>
      <View style={styles.profileCard}>
        {/* Header with image */}
        <View style={styles.header}>
          {data.image ? (
            <Image
              source={{ uri: data.image }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {data.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.name}>{data.name}</Text>
            {data.title && <Text style={styles.title}>{data.title}</Text>}
            {data.tagline && <Text style={styles.tagline}>{data.tagline}</Text>}
          </View>
        </View>

        {/* Stats */}
        {data.stats && data.stats.length > 0 && (
          <View style={styles.statsContainer}>
            {data.stats.map((stat, index) => (
              <View key={`stat-${index}`} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Bio */}
        {data.bio && (
          <View style={styles.bioContainer}>
            <Text style={styles.bio}>{data.bio}</Text>
          </View>
        )}

        {/* Highlights */}
        {data.highlights && data.highlights.length > 0 && (
          <View style={styles.highlightsContainer}>
            <Text style={styles.sectionLabel}>Highlights</Text>
            {data.highlights.map((highlight, index) => (
              <View key={`highlight-${index}`} style={styles.highlightItem}>
                <Text style={styles.highlightIcon}>✦</Text>
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Social Links */}
        {data.social && Object.keys(data.social).length > 0 && (
          <View style={styles.socialContainer}>
            {Object.entries(data.social).map(([platform, handle]) => {
              if (!handle) return null;
              return (
                <Pressable
                  key={platform}
                  style={styles.socialButton}
                  onPress={() => handleSocialPress(platform, handle)}
                >
                  <Text style={styles.socialIcon}>
                    {SOCIAL_ICONS[platform] || "🔗"}
                  </Text>
                  <Text style={styles.socialHandle}>
                    {typeof handle === "string" ? handle : platform}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    padding: SPACING.lg,
    gap: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.accentSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: "600",
    color: COLORS.accent,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  title: {
    fontSize: 15,
    color: COLORS.accent,
    marginTop: SPACING.xs,
    fontWeight: "500",
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },
  statsContainer: {
    flexDirection: "row",
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  bioContainer: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bio: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  highlightsContainer: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  highlightIcon: {
    color: COLORS.accent,
    fontSize: 14,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  socialContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceHighlight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialIcon: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  socialHandle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
