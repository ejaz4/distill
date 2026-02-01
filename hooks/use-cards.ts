import type { CardItem, ContentItem } from "@/types/content";
import { useEffect, useRef, useState } from "react";

type UseCardsOptions = {
  content: ContentItem[];
  endpoint: string;
  contentKey?: string | null;
};

type UseCardsResult = {
  cards: CardItem[];
  isLoading: boolean;
  error: string | null;
  resultsDescription: string | null;
};

const parseCardsResponse = (data: unknown): CardItem[] => {
  if (Array.isArray(data)) {
    return data as CardItem[];
  }
  if (data && typeof data === "object" && "cards" in data) {
    const maybeCards = (data as { cards?: unknown }).cards;
    if (Array.isArray(maybeCards)) {
      return maybeCards as CardItem[];
    }
  }
  return [];
};

export const useCards = ({
  content,
  endpoint,
  contentKey,
}: UseCardsOptions): UseCardsResult => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsDescription, setResultsDescription] = useState<string | null>(
    null,
  );
  const lastKeyRef = useRef<string | null | undefined>(undefined);
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (contentKey !== lastKeyRef.current) {
      lastKeyRef.current = contentKey;
      hasSentRef.current = false;
      setCards([]);
      setError(null);
      setResultsDescription(null);
    }
  }, [contentKey]);

  useEffect(() => {
    if (!endpoint || content.length === 0 || hasSentRef.current) {
      return;
    }

    const controller = new AbortController();
    const sendContent = async () => {
      try {
        setIsLoading(true);
        hasSentRef.current = true;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: content }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        const cards = parseCardsResponse(data);
        setCards(cards);

        if (data && typeof data === "object" && "resultsDescription" in data) {
          setResultsDescription(data.resultsDescription as string);
        }
      } catch (err) {
        console.error(err);
        if ((err as { name?: string }).name !== "AbortError") {
          setError((err as Error).message || "Failed to fetch cards");
        }
      } finally {
        setIsLoading(false);
      }
    };

    sendContent();

    return () => {
      controller.abort();
    };
  }, [content, endpoint]);

  useEffect(() => {
    if (!isLoading && cards.length > 0) {
      console.log("Cards response:", JSON.stringify(cards, null, 2));
    }
  }, [cards, isLoading]);

  return { cards, isLoading, error, resultsDescription };
};
