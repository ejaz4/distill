import type { DistilledResponse } from "./distilled-content";

/**
 * Represents a single distillation history entry
 */
export interface DistillationHistoryEntry {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  distilledContent: DistilledResponse;
  createdAt: number; // Unix timestamp
  componentCount: number;
}

/**
 * Storage keys used for AsyncStorage
 */
export const STORAGE_KEYS = {
  DISTILLATION_HISTORY: "@distill/history",
} as const;
