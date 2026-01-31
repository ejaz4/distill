import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import type { CardItem, ContentItem } from "@/types/content";

const cardSchema = z.object({
  cards: z.array(
    z.object({
      name: z.string(),
      image: z.string().nullable(),
    }),
  ),
});

const openrouterApiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? "";
const openrouter = createOpenRouter({
  apiKey: openrouterApiKey,
});

const useCards = (pageContent: ContentItem[]) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentForModel = useMemo(() => {
    if (!pageContent.length) return "";
    console.log("useCards: preparing content for model", {
      items: pageContent.length,
    });
    return pageContent
      .map((item) => {
        if (item.type === "text") return item.content;
        return `[image: ${item.src}]`;
      })
      .join("\n");
  }, [pageContent]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!contentForModel) return;
      console.log("useCards: starting generation");
      if (!openrouterApiKey) {
        console.log("useCards: missing OpenRouter API key");
        setError("Missing EXPO_PUBLIC_OPENROUTER_API_KEY");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("useCards: calling model");
        const result = await generateObject({
          model: openrouter("meta-llama/llama-3.1-8b-instruct"),
          schema: cardSchema,
          prompt: `You are extracting places/locations/list items from content.
Return JSON with a single field \"cards\". Each card must include a \"name\".
      For \"image\", use a URL string if it references a nearby [image: URL] token, otherwise use null.
Content:\n${contentForModel}`,
        });

        if (!cancelled) {
          console.log("useCards: generation success", {
            cardCount: result.object.cards.length,
          });
          setCards(result.object.cards);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
          console.log("useCards: generation error", err);
          console.log("useCards: generation error message", errorMessage);
          if (err && typeof err === "object") {
            console.log("useCards: generation error keys", Object.keys(err));
            console.log(
              "useCards: generation error details",
              (err as Record<string, unknown>).response ??
                (err as Record<string, unknown>).cause ??
                (err as Record<string, unknown>).data,
            );
          }
          setError(errorMessage);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          console.log("useCards: generation finished");
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [contentForModel]);

  return { cards, loading, error };
};

export default useCards;
