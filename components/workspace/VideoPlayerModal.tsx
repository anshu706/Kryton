'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, X, Sparkles, Volume2 } from 'lucide-react';
import { useResearchStore } from '@/store/useResearchStore';
import type { VideoScript } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ isOpen, onClose }: Props) {
  const { query, report, videoScript, setVideoScript } = useResearchStore();
  const [loading, setLoading] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Fetch or generate script
  useEffect(() => {
    if (isOpen && !videoScript && !loading) {
      const timer = setTimeout(() => {
        setLoading(true);
        fetch('/api/research/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, report }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.videoScript) {
              setVideoScript(data.videoScript);
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, videoScript, query, report, loading, setVideoScript]);

  const script: VideoScript | null = videoScript;
  const scenes = script?.scenes || [];
  const currentScene = scenes[currentSceneIdx];

  // Auto-advance scenes based on duration
  useEffect(() => {
    if (!isPlaying || !currentScene) return;
    const durationMs = (currentScene.duration || 12) * 1000;
    const intervalMs = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalMs;
      setProgress(Math.min((elapsed / durationMs) * 100, 100));

      if (elapsed >= durationMs) {
        clearInterval(timer);
        setProgress(0);
        if (currentSceneIdx < scenes.length - 1) {
          setCurrentSceneIdx((i) => i + 1);
        } else {
          setIsPlaying(false);
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIdx, currentScene, scenes.length]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 7, 13, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          style={{
            width: '100%',
            maxWidth: '820px',
            backgroundColor: '#1A0706',
            border: '1px solid rgba(221, 2, 0, 0.3)',
            boxShadow: '0 0 60px rgba(85, 16, 13, 0.5)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(85, 16, 13, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: 'rgba(221,2,0,0.2)',
                  color: '#DD0200',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                AI Video Explainer
              </span>
              <span style={{ fontSize: '0.85rem', color: '#D9D9D9', fontWeight: 600 }}>
                {query}
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(217,217,217,0.5)',
                cursor: 'pointer',
                display: 'flex',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Visual Screen */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '16 / 9',
              background: 'radial-gradient(ellipse at center, #55100D 0%, #1A0706 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  color: 'rgba(217,217,217,0.7)',
                }}
              >
                <Sparkles size={32} color="#DD0200" className="animate-spin-slow" />
                <p style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                  Synthesizing multi-scene documentary storyboard…
                </p>
              </div>
            ) : currentScene ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  style={{ maxWidth: '680px' }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#DD0200',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      fontWeight: 600,
                      marginBottom: '10px',
                    }}
                  >
                    Scene {currentSceneIdx + 1} of {scenes.length}: {currentScene.title}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: '#D9D9D9',
                      fontFamily: "'Space Grotesk', sans-serif",
                      marginBottom: '20px',
                    }}
                  >
                    &ldquo;{currentScene.narration}&rdquo;
                  </h3>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(85,16,13,0.4)',
                      border: '1px solid rgba(221,2,0,0.2)',
                      borderRadius: '100px',
                      padding: '6px 16px',
                      fontSize: '0.75rem',
                      color: 'rgba(217,217,217,0.6)',
                    }}
                  >
                    <Volume2 size={13} color="#DD0200" />
                    Cue: {currentScene.onScreenCue}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : null}

            {/* Progress bar across scene bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(217,217,217,0.1)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: '#DD0200',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>

          {/* Controls Footer */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(85, 16, 13, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Timeline scene dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {scenes.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSceneIdx(idx);
                    setProgress(0);
                  }}
                  style={{
                    width: '28px',
                    height: '6px',
                    borderRadius: '3px',
                    background:
                      idx === currentSceneIdx
                        ? '#DD0200'
                        : idx < currentSceneIdx
                        ? 'rgba(221,2,0,0.4)'
                        : 'rgba(217,217,217,0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  title={`Scene ${idx + 1}: ${s.title}`}
                />
              ))}
            </div>

            {/* Play / Pause / Skip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  if (currentSceneIdx > 0) {
                    setCurrentSceneIdx((i) => i - 1);
                    setProgress(0);
                  }
                }}
                disabled={currentSceneIdx === 0}
                style={ctrlBtnStyle}
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: 'linear-gradient(135deg, #DD0200, #55100D)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: '#D9D9D9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(221,2,0,0.5)',
                }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
              </button>

              <button
                onClick={() => {
                  if (currentSceneIdx < scenes.length - 1) {
                    setCurrentSceneIdx((i) => i + 1);
                    setProgress(0);
                  }
                }}
                disabled={currentSceneIdx >= scenes.length - 1}
                style={ctrlBtnStyle}
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const ctrlBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'rgba(255,255,255,0.7)',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
