'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, BookOpen, Globe } from 'lucide-react';
import { useResearchStore } from '@/store/useResearchStore';
import type { SearchFilters } from '@/types';

const PLACEHOLDER_QUERIES = [
  'How does quantum entanglement work?',
  'What are the latest breakthroughs in fusion energy?',
  'Explain the history of artificial intelligence',
  'What causes inflation and how is it controlled?',
  'Deep dive into CRISPR gene editing technology',
  'How do black holes form and evolve?',
  'The neuroscience of human decision-making',
  'What is the future of space colonization?',
];

export function SearchBar() {
  const { setQuery, setFilters, setPhase, filters } = useResearchStore();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate placeholder every 3s
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_QUERIES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // '/' keyboard shortcut to focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSubmit = useCallback(() => {
    const q = inputValue.trim();
    if (!q) return;
    setQuery(q);
    setFilters(localFilters);
    setPhase('workspace');
  }, [inputValue, localFilters, setQuery, setFilters, setPhase]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const toggleMode = (mode: SearchFilters['mode']) => {
    setLocalFilters((f) => ({ ...f, mode }));
  };

  const toggleDepth = (depth: SearchFilters['depth']) => {
    setLocalFilters((f) => ({ ...f, depth }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', maxWidth: '720px', position: 'relative', zIndex: 10 }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: isFocused ? 0 : [-4, 4, -4] }}
        transition={
          isFocused
            ? { duration: 0.2 }
            : { duration: 4, ease: 'easeInOut', repeat: Infinity }
        }
      >
        {/* Main search card */}
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 2px rgba(221,2,0,0.6), 0 0 40px rgba(221,2,0,0.35), 0 0 80px rgba(85,16,13,0.4)'
              : '0 0 20px rgba(85,16,13,0.3), 0 0 0 1px rgba(217,217,217,0.1)',
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(85,16,13,0.25)',
            border: '1px solid rgba(221,2,0,0.2)',
            borderRadius: '20px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            overflow: 'hidden',
          }}
        >
          {/* Search input row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 20px',
              gap: '12px',
            }}
          >
            <motion.div
              animate={{ color: isFocused ? '#DD0200' : 'rgba(217,217,217,0.4)' }}
              transition={{ duration: 0.2 }}
            >
              <Search size={20} />
            </motion.div>

            <div style={{ flex: 1, position: 'relative' }}>
              <AnimatePresence mode="wait">
                {!inputValue && !isFocused && (
                  <motion.span
                    key={placeholderIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(217,217,217,0.3)',
                      fontSize: '1rem',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                    }}
                  >
                    {PLACEHOLDER_QUERIES[placeholderIdx]}
                  </motion.span>
                )}
              </AnimatePresence>

              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#D9D9D9',
                  fontSize: '1rem',
                  width: '100%',
                  fontFamily: "'Inter', sans-serif",
                  caretColor: '#DD0200',
                }}
                aria-label="Research query input"
                id="kryton-search-input"
              />
            </div>

            {/* Shortcut hint */}
            {!isFocused && !inputValue && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(217,217,217,0.3)',
                  background: 'rgba(217,217,217,0.06)',
                  border: '1px solid rgba(217,217,217,0.1)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}
              >
                /
              </motion.span>
            )}

            {/* Search button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              style={{
                background: inputValue.trim()
                  ? 'linear-gradient(135deg, #DD0200, #55100D)'
                  : 'rgba(217,217,217,0.06)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                color: inputValue.trim()
                  ? '#D9D9D9'
                  : 'rgba(217,217,217,0.3)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: inputValue.trim() ? 'pointer' : 'default',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                boxShadow: inputValue.trim()
                  ? '0 0 20px rgba(221,2,0,0.45)'
                  : 'none',
                flexShrink: 0,
              }}
            >
              Research
            </motion.button>
          </div>

          {/* Filter row */}
          <div
            style={{
              borderTop: '1px solid rgba(217,217,217,0.08)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {/* Mode toggles */}
            <FilterPill
              icon={<Globe size={12} />}
              label="Web"
              active={localFilters.mode === 'web' || localFilters.mode === 'both'}
              onClick={() =>
                toggleMode(localFilters.mode === 'web' ? 'academic' : 'both')
              }
            />
            <FilterPill
              icon={<BookOpen size={12} />}
              label="Academic"
              active={
                localFilters.mode === 'academic' ||
                localFilters.mode === 'both'
              }
              onClick={() =>
                toggleMode(
                  localFilters.mode === 'academic' ? 'web' : 'both'
                )
              }
            />

            <div
              style={{
                width: '1px',
                height: '16px',
                background: 'rgba(217,217,217,0.12)',
                margin: '0 4px',
              }}
            />

            {/* Depth toggles */}
            <FilterPill
              icon={<Zap size={12} />}
              label="Quick ~10s"
              active={localFilters.depth === 'quick'}
              onClick={() => toggleDepth('quick')}
            />
            <FilterPill
              icon={<Search size={12} />}
              label="Deep ~40s"
              active={localFilters.depth === 'deep'}
              onClick={() => toggleDepth('deep')}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Filter Pill ───────────────────────────────────────────────

interface FilterPillProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterPill({ icon, label, active, onClick }: FilterPillProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 12px',
        borderRadius: '100px',
        border: active
          ? '1px solid rgba(221,2,0,0.6)'
          : '1px solid rgba(217,217,217,0.1)',
        background: active ? 'rgba(221,2,0,0.2)' : 'rgba(85,16,13,0.2)',
        color: active ? '#DD0200' : 'rgba(217,217,217,0.5)',
        fontSize: '0.75rem',
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s ease',
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
}
