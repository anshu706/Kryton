'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Grid,
  FileText,
  RotateCcw,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';
import { useResearchStore } from '@/store/useResearchStore';
import { FloatingCanvas } from './FloatingCanvas';
import { CardGrid } from './CardGrid';
import { ReportDrawer } from './ReportDrawer';
import { VideoPlayerModal } from './VideoPlayerModal';
import type { InfoCard, CitationRef } from '@/types';

export function WorkspaceLayout() {
  const {
    query,
    filters,
    cards,
    report,
    isStreaming,
    streamStatus,
    streamStep,
    streamTotal,
    cardDisplayMode,
    toggleCardDisplayMode,
    addCard,
    appendReport,
    setCitations,
    setIsStreaming,
    setStreamStatus,
    setPhase,
    resetResearch,
  } = useResearchStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const streamStartedRef = useRef(false);

  // ── Stream research pipeline ────────────────────────────────────────────────
  const runResearchStream = useCallback(async () => {
    if (!query) return;

    setIsStreaming(true);
    setStreamStatus('Initializing deep research vectors…', 0, 5);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Research request failed: ${res.statusText}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const lines = part.split('\n');
          let eventType = '';
          let dataStr = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr = line.slice(6).trim();
            }
          }

          if (!eventType || !dataStr) continue;

          try {
            const data = JSON.parse(dataStr);
            if (eventType === 'status') {
              setStreamStatus(data.message, data.step, data.total);
            } else if (eventType === 'card') {
              addCard(data as InfoCard);
            } else if (eventType === 'report_chunk') {
              appendReport(data.text);
            } else if (eventType === 'report_done') {
              setCitations(data.citations as CitationRef[]);
              setIsDrawerOpen(true); // Automatically open report when ready
            } else if (eventType === 'error') {
              console.error('Research stream error:', data.message);
            }
          } catch {
            // ignore JSON parse chunk splits
          }
        }
      }
    } catch (err) {
      console.error('Stream failure:', err);
      setStreamStatus('Stream interrupted. Working from cached vectors.', 5, 5);
    } finally {
      setIsStreaming(false);
    }
  }, [
    query,
    filters,
    addCard,
    appendReport,
    setCitations,
    setIsStreaming,
    setStreamStatus,
  ]);

  // Run on mount if cards/report are empty
  useEffect(() => {
    if (!streamStartedRef.current && cards.length === 0 && !report) {
      streamStartedRef.current = true;
      runResearchStream();
    }
  }, [cards.length, report, runResearchStream]);

  // Keyboard shortcut: Escape closes drawer/modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsVideoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewResearch = () => {
    resetResearch();
    setPhase('landing');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1A0706',
        color: '#D9D9D9',
        overflow: 'hidden',
      }}
    >
      {/* ── Top Header Navigation Bar ────────────────────────────────────────── */}
      <header
        style={{
          height: '64px',
          borderBottom: '1px solid rgba(85, 16, 13, 0.6)',
          backgroundColor: 'rgba(26, 7, 6, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 35,
          position: 'relative',
        }}
      >
        {/* Left: Brand + Query badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={handleNewResearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#D9D9D9',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #DD0200, #55100D)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: '0 0 12px rgba(221,2,0,0.5)',
                color: '#D9D9D9',
              }}
            >
              K
            </div>
            <span
              className="brand-title"
              style={{
                fontSize: '1.05rem',
                letterSpacing: '0.12em',
                background: 'linear-gradient(135deg, #D9D9D9 40%, #DD0200 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              KRYTON
            </span>
          </button>

          <div
            style={{
              width: '1px',
              height: '20px',
              background: 'rgba(217,217,217,0.1)',
            }}
          />

          {/* Active Query Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(85,16,13,0.3)',
              border: '1px solid rgba(221,2,0,0.2)',
              borderRadius: '100px',
              padding: '6px 14px',
              maxWidth: '380px',
            }}
          >
            <Search size={13} color="#DD0200" />
            <span
              style={{
                fontSize: '0.82rem',
                color: '#D9D9D9',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {query || 'Research Workspace'}
            </span>

            <span
              style={{
                fontSize: '0.68rem',
                color: 'rgba(221,2,0,0.9)',
                background: 'rgba(221,2,0,0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {filters.mode}
            </span>
          </div>
        </div>

        {/* Center: Live Research Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isStreaming ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(221,2,0,0.1)',
                border: '1px solid rgba(221,2,0,0.3)',
                borderRadius: '100px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                color: '#DD0200',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#DD0200',
                  boxShadow: '0 0 10px #DD0200',
                }}
                className="animate-pulse-glow"
              />
              <span style={{ fontWeight: 500 }}>
                {streamStatus || 'Illuminating research…'}
              </span>
              <span style={{ color: 'rgba(217,217,217,0.5)', fontSize: '0.7rem' }}>
                ({streamStep}/{streamTotal})
              </span>
            </motion.div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: 'rgba(217,217,217,0.5)',
              }}
            >
              <Sparkles size={13} color="#DD0200" />
              <span>{cards.length} nodes synthesized</span>
            </div>
          )}
        </div>

        {/* Right: View Toggles & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Card Display Mode Switch */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(85,16,13,0.3)',
              border: '1px solid rgba(217,217,217,0.1)',
              borderRadius: '8px',
              padding: '2px',
            }}
          >
            <button
              onClick={() => {
                if (cardDisplayMode !== 'float') toggleCardDisplayMode();
              }}
              style={{
                ...toggleBtnStyle,
                background:
                  cardDisplayMode === 'float'
                    ? 'rgba(221,2,0,0.2)'
                    : 'transparent',
                color:
                  cardDisplayMode === 'float'
                    ? '#DD0200'
                    : 'rgba(217,217,217,0.6)',
              }}
              title="Floating Node Canvas"
            >
              <Compass size={14} />
              <span>Canvas</span>
            </button>

            <button
              onClick={() => {
                if (cardDisplayMode !== 'grid') toggleCardDisplayMode();
              }}
              style={{
                ...toggleBtnStyle,
                background:
                  cardDisplayMode === 'grid'
                    ? 'rgba(221,2,0,0.2)'
                    : 'transparent',
                color:
                  cardDisplayMode === 'grid'
                    ? '#DD0200'
                    : 'rgba(217,217,217,0.6)',
              }}
              title="Category Grid View"
            >
              <Grid size={14} />
              <span>Grid</span>
            </button>
          </div>

          {/* Toggle Report Drawer Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isDrawerOpen
                ? 'rgba(221,2,0,0.25)'
                : 'linear-gradient(135deg, #DD0200, #55100D)',
              border: isDrawerOpen ? '1px solid #DD0200' : 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#D9D9D9',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: isDrawerOpen ? 'none' : '0 0 15px rgba(221,2,0,0.4)',
              transition: 'all 0.2s',
            }}
          >
            <FileText size={14} />
            <span>Synthesis Report</span>
            {report && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                }}
              />
            )}
          </motion.button>

          {/* New Search */}
          <button
            onClick={handleNewResearch}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '8px',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Start new research"
            aria-label="Start new research"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Dynamic Stage ──────────────────────────────────────────────── */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {cardDisplayMode === 'float' ? <FloatingCanvas /> : <CardGrid />}
      </main>

      {/* ── Right-Side Slideout Report Drawer ───────────────────────────────── */}
      <ReportDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
      />

      {/* ── AI Video Explainer Modal ────────────────────────────────────────── */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}

const toggleBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: "'Inter', sans-serif",
  transition: 'all 0.15s ease',
};
