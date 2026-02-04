import type { DistilledResponse } from "@/types/distilled-content";
import { type DistillationHistoryEntry, STORAGE_KEYS } from "@/types/history";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Generate a unique ID for history entries
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Extract a title from distilled content
 */
function extractTitle(content: DistilledResponse): string {
  if (!content.components || content.components.length === 0) {
    return "Untitled";
  }

  const firstComponent = content.components[0];

  // Try to get title from various component types
  if ("title" in firstComponent && firstComponent.title) {
    return firstComponent.title;
  }
  if ("headline" in firstComponent && firstComponent.headline) {
    return firstComponent.headline;
  }
  if ("name" in firstComponent && firstComponent.name) {
    return firstComponent.name;
  }

  return "Untitled";
}

/**
 * Extract a subtitle/description from distilled content
 */
function extractSubtitle(content: DistilledResponse): string | undefined {
  if (!content.components || content.components.length === 0) {
    return undefined;
  }

  const firstComponent = content.components[0];

  if ("subtitle" in firstComponent && firstComponent.subtitle) {
    return firstComponent.subtitle;
  }
  if ("subheadline" in firstComponent && firstComponent.subheadline) {
    return firstComponent.subheadline;
  }
  if ("description" in firstComponent && firstComponent.description) {
    return typeof firstComponent.description === "string"
      ? firstComponent.description
      : undefined;
  }
  if ("summary" in firstComponent && firstComponent.summary) {
    return firstComponent.summary;
  }

  return undefined;
}

/**
 * Extract a thumbnail image from distilled content
 */
function extractThumbnail(content: DistilledResponse): string | undefined {
  if (!content.components || content.components.length === 0) {
    return undefined;
  }

  for (const component of content.components) {
    if ("heroImage" in component && component.heroImage) {
      return component.heroImage;
    }
    if ("image" in component && component.image) {
      return component.image;
    }
    if ("cards" in component && component.cards?.length > 0) {
      const firstCard = component.cards[0];
      if (firstCard.image) return firstCard.image;
      if (firstCard.banner) return firstCard.banner;
    }
    if ("images" in component && component.images?.length > 0) {
      return component.images[0].url;
    }
  }

  return undefined;
}

/**
 * Get all distillation history entries
 */
export async function getDistillationHistory(): Promise<
  DistillationHistoryEntry[]
> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DISTILLATION_HISTORY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // Sort by most recent first
    return parsed.sort(
      (a: DistillationHistoryEntry, b: DistillationHistoryEntry) =>
        b.createdAt - a.createdAt,
    );
  } catch (error) {
    console.error("Error reading distillation history:", error);
    return [];
  }
}

/**
 * Save a new distillation to history
 */
export async function saveDistillation(
  url: string,
  content: DistilledResponse,
): Promise<DistillationHistoryEntry> {
  try {
    const history = await getDistillationHistory();

    // Check if we already have this URL - update if so
    const existingIndex = history.findIndex((entry) => entry.url === url);

    const entry: DistillationHistoryEntry = {
      id: existingIndex >= 0 ? history[existingIndex].id : generateId(),
      url,
      title: extractTitle(content),
      subtitle: extractSubtitle(content),
      thumbnail: extractThumbnail(content),
      distilledContent: content,
      createdAt: Date.now(),
      componentCount: content.components?.length || 0,
    };

    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex] = entry;
    } else {
      // Add new entry at the beginning
      history.unshift(entry);
    }

    // Keep only the last 50 entries to prevent storage bloat
    const trimmedHistory = history.slice(0, 50);

    await AsyncStorage.setItem(
      STORAGE_KEYS.DISTILLATION_HISTORY,
      JSON.stringify(trimmedHistory),
    );

    return entry;
  } catch (error) {
    console.error("Error saving distillation:", error);
    throw error;
  }
}

/**
 * Get a specific distillation by ID
 */
export async function getDistillationById(
  id: string,
): Promise<DistillationHistoryEntry | null> {
  try {
    const history = await getDistillationHistory();
    return history.find((entry) => entry.id === id) || null;
  } catch (error) {
    console.error("Error getting distillation by ID:", error);
    return null;
  }
}

/**
 * Delete a distillation from history
 */
export async function deleteDistillation(id: string): Promise<void> {
  try {
    const history = await getDistillationHistory();
    const filtered = history.filter((entry) => entry.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.DISTILLATION_HISTORY,
      JSON.stringify(filtered),
    );
  } catch (error) {
    console.error("Error deleting distillation:", error);
    throw error;
  }
}

/**
 * Clear all distillation history
 */
export async function clearDistillationHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.DISTILLATION_HISTORY);
  } catch (error) {
    console.error("Error clearing distillation history:", error);
    throw error;
  }
}
