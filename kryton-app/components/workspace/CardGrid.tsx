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
    {
      id: 'source',
      label: `Sources (${cards.filter((c) => c.type === 'source').length})`,
    },
    {
      id: 'academic',
      label: `Papers (${cards.filter((c) => c.type === 'academic').length})`,
    },
    {
      id: 'stat',
      label: `Stats (${cards.filter((c) => c.type === 'stat').length})`,
    },
    {
      id: 'fact',
      label: `Insights (${cards.filter((c) => c.type === 'fact').length})`,
    },
    {
      id: 'related',
      label: `Branches (${cards.filter((c) => c.type === 'related').length})`,
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: '32px',
        background: '#05070D',
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
                  ? 'rgba(30,107,255,0.2)'
                  : 'rgba(255,255,255,0.04)',
              border:
                activeTab === tab.id
                  ? '1px solid #1E6BFF'
                  : '1px solid rgba(255,255,255,0.08)',
              color: activeTab === tab.id ? '#1E6BFF' : 'rgba(255,255,255,0.6)',
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
