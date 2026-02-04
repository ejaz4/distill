import type { DistilledResponse } from "@/types/distilled-content";
import React, { createContext, useCallback, useContext, useState } from "react";

interface ShareContextValue {
  shareableContent: DistilledResponse | null;
  sourceUrl: string | null;
  setShareableContent: (
    content: DistilledResponse | null,
    url: string | null,
  ) => void;
  clearShareableContent: () => void;
}

const ShareContext = createContext<ShareContextValue | undefined>(undefined);

export function ShareProvider({ children }: { children: React.ReactNode }) {
  const [shareableContent, setContent] = useState<DistilledResponse | null>(
    null,
  );
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  const setShareableContent = useCallback(
    (content: DistilledResponse | null, url: string | null) => {
      setContent(content);
      setSourceUrl(url);
    },
    [],
  );

  const clearShareableContent = useCallback(() => {
    setContent(null);
    setSourceUrl(null);
  }, []);

  return (
    <ShareContext.Provider
      value={{
        shareableContent,
        sourceUrl,
        setShareableContent,
        clearShareableContent,
      }}
    >
      {children}
    </ShareContext.Provider>
  );
}

export function useShareContext() {
  const context = useContext(ShareContext);
  if (!context) {
    throw new Error("useShareContext must be used within a ShareProvider");
  }
  return context;
}
