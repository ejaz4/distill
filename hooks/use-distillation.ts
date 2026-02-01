import type {
    DistilledComponent,
    DistilledResponse,
} from "@/types/distilled-content";
import { useEffect, useRef, useState } from "react";

// ============================================================================
// Types
// ============================================================================
export type ContentItem =
  | { type: "text"; content: string }
  | { type: "image"; src: string };

interface UseDistillationOptions {
  content: ContentItem[];
  endpoint: string;
  contentKey?: string | null;
}

interface UseDistillationResult {
  distilledContent: DistilledResponse | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Response Parsing
// ============================================================================
function parseDistilledResponse(data: unknown): DistilledResponse {
  // Handle direct response with components array
  if (data && typeof data === "object" && "components" in data) {
    const components = (data as { components?: unknown }).components;
    if (Array.isArray(components)) {
      return { components: components as DistilledComponent[] };
    }
  }

  // Handle legacy cards format - convert to new format
  if (data && typeof data === "object" && "cards" in data) {
    const legacyCards = (data as { cards?: unknown }).cards;
    if (Array.isArray(legacyCards)) {
      return {
        components: [
          {
            type: "cards",
            title: "Distilled Content",
            cards: legacyCards.map((card: unknown) => {
              if (typeof card === "object" && card !== null) {
                const c = card as Record<string, unknown>;
                return {
                  title: String(c.name || c.title || "Untitled"),
                  subtitle: c.subtitle ? String(c.subtitle) : undefined,
                  image: c.image ? String(c.image) : undefined,
                  summary: c.shortDescription
                    ? String(c.shortDescription)
                    : undefined,
                };
              }
              return { title: "Untitled" };
            }),
          },
        ],
      };
    }
  }

  // Handle array of components directly
  if (Array.isArray(data)) {
    return { components: data as DistilledComponent[] };
  }

  // Fallback - create article from text
  if (data && typeof data === "object") {
    const text = JSON.stringify(data, null, 2);
    return {
      components: [
        {
          type: "article",
          title: "Distilled Content",
          content: text,
        },
      ],
    };
  }

  // Empty fallback
  return { components: [] };
}

// ============================================================================
// Hook
// ============================================================================
export function useDistillation({
  content,
  endpoint,
  contentKey,
}: UseDistillationOptions): UseDistillationResult {
  const [distilledContent, setDistilledContent] =
    useState<DistilledResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastKeyRef = useRef<string | null | undefined>(undefined);
  const hasSentRef = useRef(false);

  // Reset state when contentKey changes
  useEffect(() => {
    if (contentKey !== lastKeyRef.current) {
      lastKeyRef.current = contentKey;
      hasSentRef.current = false;
      setDistilledContent(null);
      setError(null);
    }
  }, [contentKey]);

  // Send content for distillation
  useEffect(() => {
    if (!endpoint || content.length === 0 || hasSentRef.current) {
      return;
    }

    const controller = new AbortController();

    const distillContent = async () => {
      try {
        setIsLoading(true);
        hasSentRef.current = true;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: content,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        const parsed = parseDistilledResponse(data);
        setDistilledContent(parsed);

        // Debug log
        console.log("Distilled response:", JSON.stringify(parsed, null, 2));
      } catch (err) {
        console.error("Distillation error:", err);
        if ((err as { name?: string }).name !== "AbortError") {
          setError((err as Error).message || "Failed to distill content");
        }
      } finally {
        setIsLoading(false);
      }
    };

    distillContent();

    return () => {
      controller.abort();
    };
  }, [content, endpoint]);

  return { distilledContent, isLoading, error };
}
