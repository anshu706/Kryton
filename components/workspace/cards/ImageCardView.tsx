'use client';

import { motion } from 'framer-motion';
import { Image as ImageIcon, ExternalLink, ZoomIn } from 'lucide-react';
import type { ImageCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';
import { useState } from 'react';

interface Props {
  card: ImageCard;
  isFloating?: boolean;
}

export function ImageCardView({ card, isFloating }: Props) {
  const { highlightedCardId, setHighlightedCardId } = useResearchStore();
  const isHighlighted = highlightedCardId === card.id;
  const [imgError, setImgError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <motion.div
        layout
        whileHover={{ scale: 1.02, y: -2 }}
        onClick={() => setHighlightedCardId(isHighlighted ? null : card.id)}
        style={{
          background: isHighlighted
            ? 'linear-gradient(135deg, rgba(85,16,13,0.8), rgba(26,7,6,0.95))'
            : 'linear-gradient(135deg, rgba(85,16,13,0.5), rgba(26,7,6,0.85))',
          border: isHighlighted
            ? '2px solid #DD0200'
            : '1px solid rgba(221,2,0,0.35)',
          boxShadow: isHighlighted
            ? '0 0 32px rgba(221,2,0,0.5)'
            : '0 6px 24px rgba(0,0,0,0.5)',
          borderRadius: '16px',
          overflow: 'hidden',
          color: '#D9D9D9',
          width: isFloating ? '320px' : '100%',
          backdropFilter: 'blur(16px)',
          cursor: 'pointer',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px 8px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#DD0200',
            }}
          >
            <ImageIcon size={11} />
            Image Reference
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
            style={{
              background: 'rgba(217,217,217,0.08)',
              border: '1px solid rgba(217,217,217,0.12)',
              borderRadius: '6px',
              padding: '3px 7px',
              color: 'rgba(217,217,217,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.68rem',
            }}
          >
            <ZoomIn size={11} />
            View
          </button>
        </div>

        {/* Image */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            background: 'rgba(26,7,6,0.8)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.src}
              alt={card.caption}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'rgba(217,217,217,0.3)',
                fontSize: '0.78rem',
              }}
            >
              <ImageIcon size={28} />
              <span>Image unavailable</span>
            </div>
          )}

          {/* Racing Red gradient overlay at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to top, rgba(26,7,6,0.85), transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Caption & Link */}
        <div style={{ padding: '10px 14px 12px' }}>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'rgba(217,217,217,0.85)',
              lineHeight: 1.45,
              marginBottom: '8px',
              fontStyle: 'italic',
            }}
          >
            {card.caption}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid rgba(85,16,13,0.7)',
              fontSize: '0.7rem',
            }}
          >
            <span style={{ color: 'rgba(217,217,217,0.4)' }}>
              {card.credit || 'Archival / Public Domain'}
            </span>
            <a
              href={card.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                color: '#DD0200',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              Source <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(26,7,6,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.src}
            alt={card.caption}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '12px',
              border: '2px solid rgba(221,2,0,0.4)',
              boxShadow: '0 0 60px rgba(221,2,0,0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(217,217,217,0.7)',
              fontSize: '0.85rem',
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: '600px',
            }}
          >
            {card.caption}
          </div>
        </div>
      )}
    </>
  );
}

