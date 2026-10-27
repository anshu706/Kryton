// ============================================================
// KRYTON — Shared TypeScript Types
// ============================================================

export type Phase = 'intro' | 'landing' | 'workspace';
export type ResearchDepth = 'quick' | 'deep';
export type SearchMode = 'web' | 'academic' | 'both';

// ── Info Card Union ──────────────────────────────────────────

export type CardType =
  | 'source'
  | 'image'
  | 'academic'
  | 'fact'
  | 'stat'
  | 'related';

export interface BaseCard {
  id: string;
  type: CardType;
  /** Initial floating position (percentage of container) */
  x: number;
  y: number;
  isExpanded?: boolean;
}

export interface SourceCard extends BaseCard {
  type: 'source';
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
  reliability: number; // 0–1
  citationIndex: number;
}

export interface ImageCard extends BaseCard {
  type: 'image';
  src: string;
  caption: string;
  sourceUrl: string;
}

export interface AcademicCard extends BaseCard {
  type: 'academic';
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  pdfUrl: string;
  doi?: string;
}

export interface FactCard extends BaseCard {
  type: 'fact';
  insight: string;
  confidence: number; // 0–1
  sourceId?: string;
}

export interface StatCard extends BaseCard {
  type: 'stat';
  value: number;
  unit: string;
  label: string;
  sourceId?: string;
}

export interface RelatedQueryCard extends BaseCard {
  type: 'related';
  query: string;
  reason: string;
}

export type InfoCard =
  | SourceCard
  | ImageCard
  | AcademicCard
  | FactCard
  | StatCard
  | RelatedQueryCard;

// ── Video / Script ───────────────────────────────────────────

export interface SceneMarker {
  id: string;
  title: string;
  narration: string;
  onScreenCue: string;
  duration: number; // seconds
  highlightCardId?: string;
}

export interface VideoScript {
  topic: string;
  totalDuration: number;
  scenes: SceneMarker[];
  rawText: string;
}

// ── Search ───────────────────────────────────────────────────

export interface SearchFilters {
  mode: SearchMode;
  depth: ResearchDepth;
}

export interface SearchQuery {
  text: string;
  filters: SearchFilters;
  timestamp: number;
}

// ── Citations ────────────────────────────────────────────────

export interface CitationRef {
  index: number;
  title: string;
  url: string;
  authors?: string[];
  year?: number;
  publisher?: string;
}

export type CitationFormat = 'apa' | 'mla' | 'bibtex';

// ── Research Stream Events ────────────────────────────────────

export type StreamEventType =
  | 'status'
  | 'card'
  | 'report_chunk'
  | 'report_done'
  | 'error';

export interface StreamEvent {
  type: StreamEventType;
  payload: unknown;
}

export interface StatusEvent extends StreamEvent {
  type: 'status';
  payload: { message: string; step: number; total: number };
}

export interface CardEvent extends StreamEvent {
  type: 'card';
  payload: InfoCard;
}

export interface ReportChunkEvent extends StreamEvent {
  type: 'report_chunk';
  payload: { text: string };
}

export interface ReportDoneEvent extends StreamEvent {
  type: 'report_done';
  payload: { citations: CitationRef[] };
}
