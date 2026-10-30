'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useResearchStore } from '@/store/useResearchStore';
import { CardItem } from './cards/CardItem';
import type { CardType } from '@/types';

type FilterTab = 'all' | CardType;

export function CardGrid() {
  const { cards } = useResearchStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredCards =
    activeTab === 'all' ? cards : cards.filter((c) => c.type === activeTab);

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: `All (${cards.length})` },
    ...(cards.some((c) => c.type === 'wikipedia')
      ? [{ id: 'wikipedia' as FilterTab, label: `Wikipedia (${cards.filter((c) => c.type === 'wikipedia').length})` }]
      : []),
    ...(cards.some((c) => c.type === 'newspaper')
      ? [{ id: 'newspaper' as FilterTab, label: `Newspapers (${cards.filter((c) => c.type === 'newspaper').length})` }]
      : []),
    ...(cards.some((c) => c.type === 'letter')
      ? [{ id: 'letter' as FilterTab, label: `Letters & Dispatches (${cards.filter((c) => c.type === 'letter').length})` }]
      : []),
    ...(cards.some((c) => c.type === 'source')
      ? [{ id: 'source' as FilterTab, label: `Sources (${cards.filter((c) => c.type === 'source').length})` }]
      : []),
    ...(cards.some((c) => c.type === 'academic')
      ? [{ id: 'academic' as FilterTab, label: `Papers (${cards.filter((c) => c.type === 'academic').length})` }]
      : []),
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: '32px',
        background: '#1A0706',
      }}
    >
      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background:
                activeTab === tab.id
                  ? 'rgba(221,2,0,0.2)'
                  : 'rgba(85,16,13,0.3)',
              border:
                activeTab === tab.id
                  ? '1px solid #DD0200'
                  : '1px solid rgba(85,16,13,0.6)',
              color: activeTab === tab.id ? '#DD0200' : 'rgba(217,217,217,0.6)',
              borderRadius: '100px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Container */}
      <motion.div
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredCards.map((card) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <CardItem card={card} isFloating={false} />
          </motion.div>
        ))}
      </motion.div>

      {filteredCards.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.9rem',
          }}
        >
          No cards discovered in this category yet.
        </div>
      )}
    </div>
  );
}
