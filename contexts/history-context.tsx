import {
  deleteDistillation,
  getDistillationHistory,
  saveDistillation,
} from "@/services/storage";
import type { DistilledResponse } from "@/types/distilled-content";
import type { DistillationHistoryEntry } from "@/types/history";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface HistoryContextValue {
  history: DistillationHistoryEntry[];
  isLoading: boolean;
  refreshHistory: () => Promise<void>;
  addToHistory: (
    url: string,
    content: DistilledResponse,
  ) => Promise<DistillationHistoryEntry>;
  removeFromHistory: (id: string) => Promise<void>;
  getEntryById: (id: string) => DistillationHistoryEntry | undefined;
}

const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined,
);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<DistillationHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshHistory = useCallback(async () => {
    try {
      const entries = await getDistillationHistory();
      setHistory(entries);
    } catch (error) {
      console.error("Failed to refresh history:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const addToHistory = useCallback(
    async (url: string, content: DistilledResponse) => {
      const entry = await saveDistillation(url, content);
      // Refresh the history to get the updated list
      await refreshHistory();
      return entry;
    },
    [refreshHistory],
  );

  const removeFromHistory = useCallback(
    async (id: string) => {
      await deleteDistillation(id);
      await refreshHistory();
    },
    [refreshHistory],
  );

  const getEntryById = useCallback(
    (id: string) => {
      return history.find((entry) => entry.id === id);
    },
    [history],
  );

  return (
    <HistoryContext.Provider
      value={{
        history,
        isLoading,
        refreshHistory,
        addToHistory,
        removeFromHistory,
        getEntryById,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
