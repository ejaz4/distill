import { ShareGuideGlyph } from "@/assets/images/svg/share-guide-glyph";
import { ActivityLoader } from "@/components/activity-loader";
import { ThemedText } from "@/components/themed-text";
import { useHistory } from "@/contexts/history-context";
import type { DistillationHistoryEntry } from "@/types/history";
import { useRouter } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// Recent item card component with beautiful animations
function RecentCard({
  entry,
  index,
  onPress,
}: {
  entry: DistillationHistoryEntry;
  index: number;
  onPress: () => void;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 30, scale: 0.97 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: "timing",
        duration: 500,
        delay: 150 + index * 100,
      }}
    >
      <Pressable
        style={({ pressed }) => [
          styles.recentCard,
          pressed && styles.recentCardPressed,
        ]}
        onPress={onPress}
      >
        {entry.thumbnail ? (
          <Image
            source={{ uri: entry.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.thumbnailEmoji}>✨</Text>
          </View>
        )}

        <View style={styles.recentCardContent}>
          <Text style={styles.recentTitle} numberOfLines={2}>
            {entry.title}
          </Text>
          {entry.subtitle && (
            <Text style={styles.recentSubtitle} numberOfLines={1}>
              {entry.subtitle}
            </Text>
          )}
          <View style={styles.recentMeta}>
            <Text style={styles.recentTime}>
              {formatRelativeTime(entry.createdAt)}
            </Text>
            <View style={styles.componentBadge}>
              <Text style={styles.componentBadgeText}>
                {entry.componentCount} section
                {entry.componentCount !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.chevron}>
          <Text style={styles.chevronText}>›</Text>
        </View>
      </Pressable>
    </MotiView>
  );
}

// Empty state animation
function EmptyRecents() {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "timing", duration: 600, delay: 300 }}
      style={styles.emptyContainer}
    >
      <Text style={styles.emptyEmoji}>📚</Text>
      <Text style={styles.emptyText}>No distillations yet</Text>
      <Text style={styles.emptySubtext}>Share a link to get started</Text>
    </MotiView>
  );
}

// Recents section with staggered animations
function RecentsSection() {
  const { history, isLoading } = useHistory();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Small delay before showing content for smooth entrance
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!showContent || isLoading) {
    return null;
  }

  const handleRecentPress = (entry: DistillationHistoryEntry) => {
    router.push({
      pathname: "/distill",
      params: { url: entry.url, historyId: entry.id },
    });
  };

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.recentsSection}
    >
      <MotiView
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 450, delay: 50 }}
      >
        <Text style={styles.sectionTitle}>Recents</Text>
      </MotiView>

      {history.length === 0 ? (
        <EmptyRecents />
      ) : (
        <ScrollView
          style={styles.recentsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recentsListContent}
        >
          {history.slice(0, 10).map((entry, index) => (
            <RecentCard
              key={entry.id}
              entry={entry}
              index={index}
              onPress={() => handleRecentPress(entry)}
            />
          ))}
        </ScrollView>
      )}
    </MotiView>
  );
}

// Main page component
const ShareCheckerPage = () => {
  const router = useRouter();
  const { hasShareIntent, shareIntent } = useShareIntentContext();
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    if (hasShareIntent && shareIntent?.webUrl) {
      try {
        new URL(shareIntent.webUrl);
        router.push({
          pathname: "/distill",
          params: { url: shareIntent.webUrl },
        });
      } catch {
        // Invalid URL, don't navigate
      }
    }
  }, [hasShareIntent, shareIntent, router]);

  useEffect(() => {
    // Hide guide after animation completes to show recents
    const timer = setTimeout(() => setShowGuide(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (hasShareIntent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityLoader />
        <ThemedText style={styles.loadingText}>
          Opening distillation...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showGuide ? (
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: "timing", duration: 600 }}
          style={styles.guideContainer}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 700, delay: 100 }}
          >
            <ShareGuideGlyph />
          </MotiView>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 500, delay: 300 }}
          >
            <ActivityLoader />
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 500 }}
          >
            <ThemedText style={styles.guideText}>
              Tap Share and select Distill to begin distilling sites and text.
            </ThemedText>
          </MotiView>
        </MotiView>
      ) : (
        <RecentsSection />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
  guideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  guideText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    paddingHorizontal: 32,
  },
  recentsSection: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  recentsList: {
    flex: 1,
  },
  recentsListContent: {
    gap: 12,
    paddingBottom: 24,
  },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  recentCardPressed: {
    backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ scale: 0.98 }],
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  thumbnailPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(10,132,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailEmoji: {
    fontSize: 24,
  },
  recentCardContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 20,
  },
  recentSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  recentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  recentTime: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  componentBadge: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  componentBadgeText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
  },
  chevron: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronText: {
    fontSize: 24,
    color: "rgba(255,255,255,0.3)",
    fontWeight: "300",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    marginTop: 4,
  },
});

export default ShareCheckerPage;
