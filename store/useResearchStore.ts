'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Phase,
  InfoCard,
  CitationRef,
  VideoScript,
  SearchFilters,
} from '@/types';

interface ResearchStore {
  // ── Phase machine ──────────────────────────────────────────
  phase: Phase;
  setPhase: (phase: Phase) => void;

  // ── Active query ───────────────────────────────────────────
  query: string;
  filters: SearchFilters;
  setQuery: (q: string) => void;
  setFilters: (f: SearchFilters) => void;

  // ── Research output ────────────────────────────────────────
  cards: InfoCard[];
  report: string;
  citations: CitationRef[];
  isStreaming: boolean;
  streamStatus: string;
  streamStep: number;
  streamTotal: number;

  // ── Video ──────────────────────────────────────────────────
  videoScript: VideoScript | null;
  isGeneratingVideo: boolean;

  // ── UI state ───────────────────────────────────────────────
  cardDisplayMode: 'float' | 'grid';
  activeDrawerTab: string;
  highlightedCardId: string | null;
  highlightedCitationIndex: number | null;

  // ── Actions ────────────────────────────────────────────────
  addCard: (card: InfoCard) => void;
  appendReport: (chunk: string) => void;
  setCitations: (citations: CitationRef[]) => void;
  setIsStreaming: (v: boolean) => void;
  setStreamStatus: (msg: string, step: number, total: number) => void;
  setVideoScript: (script: VideoScript | null) => void;
  setIsGeneratingVideo: (v: boolean) => void;
  toggleCardDisplayMode: () => void;
  setActiveDrawerTab: (tab: string) => void;
  setHighlightedCardId: (id: string | null) => void;
  setHighlightedCitation: (index: number | null) => void;
  resetResearch: () => void;
}

const defaultFilters: SearchFilters = {
  mode: 'both',
  depth: 'deep',
};

export const useResearchStore = create<ResearchStore>()(
  persist(
    (set, get) => ({
      // ── Phase ──────────────────────────────────────────────
      phase: 'intro',
      setPhase: (phase) => set({ phase }),

      // ── Query ──────────────────────────────────────────────
      query: '',
      filters: defaultFilters,
      setQuery: (query) => set({ query }),
      setFilters: (filters) => set({ filters }),

      // ── Research state ─────────────────────────────────────
      cards: [],
      report: '',
      citations: [],
      isStreaming: false,
      streamStatus: '',
      streamStep: 0,
      streamTotal: 6,
      videoScript: null,
      isGeneratingVideo: false,

      // ── UI ─────────────────────────────────────────────────
      cardDisplayMode: 'float',
      activeDrawerTab: 'report',
      highlightedCardId: null,
      highlightedCitationIndex: null,

      // ── Actions ────────────────────────────────────────────
      addCard: (card) =>
        set((s) => ({ cards: [...s.cards, card] })),

      appendReport: (chunk) =>
        set((s) => ({ report: s.report + chunk })),

      setCitations: (citations) => set({ citations }),

      setIsStreaming: (isStreaming) => set({ isStreaming }),

      setStreamStatus: (streamStatus, streamStep, streamTotal) =>
        set({ streamStatus, streamStep, streamTotal }),

      setVideoScript: (videoScript) => set({ videoScript }),
      setIsGeneratingVideo: (isGeneratingVideo) =>
        set({ isGeneratingVideo }),

      toggleCardDisplayMode: () =>
        set((s) => ({
          cardDisplayMode: s.cardDisplayMode === 'float' ? 'grid' : 'float',
        })),

      setActiveDrawerTab: (activeDrawerTab) => set({ activeDrawerTab }),

      setHighlightedCardId: (highlightedCardId) =>
        set({ highlightedCardId }),

      setHighlightedCitation: (highlightedCitationIndex) =>
        set({ highlightedCitationIndex }),

      resetResearch: () =>
        set({
          cards: [],
          report: '',
          citations: [],
          isStreaming: false,
          streamStatus: '',
          streamStep: 0,
          videoScript: null,
          highlightedCardId: null,
          highlightedCitationIndex: null,
        }),
    }),
    {
      name: 'kryton-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return sessionStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (s) => ({
        phase: s.phase,
        query: s.query,
        filters: s.filters,
        cardDisplayMode: s.cardDisplayMode,
      }),
    }
  )
);
