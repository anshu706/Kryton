'use client';

import { motion } from 'framer-motion';
import { Play, ExternalLink, Video } from 'lucide-react';
import type { VideoCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';
import { useState } from 'react';

interface Props {
  card: VideoCard;
  isFloating?: boolean;
}

export function VideoCardView({ card, isFloating }: Props) {
  const { highlightedCardId, setHighlightedCardId } = useResearchStore();
  const isHighlighted = highlightedCardId === card.id;
  const [thumbError, setThumbError] = useState(false);

  return (
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
      {/* Thumbnail with Play overlay */}
      <a
        href={card.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'block', position: 'relative', textDecoration: 'none' }}
      >
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            background: 'rgba(26,7,6,0.9)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {!thumbError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.thumbnailUrl}
              alt={card.title}
              onError={() => setThumbError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(85,16,13,0.3)',
              }}
            >
              <Video size={36} color="rgba(221,2,0,0.6)" />
            </div>
          )}

          {/* Dark gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(26,7,6,0.35)',
              transition: 'background 0.2s',
            }}
          />

          {/* Play button */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(221,2,0,0.9)',
                boxShadow: '0 0 20px rgba(221,2,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={20} fill="#D9D9D9" color="#D9D9D9" style={{ marginLeft: '3px' }} />
            </div>
          </div>

          {/* Duration badge */}
          {card.duration && (
            <span
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(26,7,6,0.85)',
                color: '#D9D9D9',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {card.duration}
            </span>
          )}
        </div>
      </a>

      {/* Meta */}
      <div style={{ padding: '12px 14px' }}>
        {/* Channel badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#DD0200',
            }}
          >
            <Video size={11} />
            {card.channel}
          </span>
          {card.publishedAt && (
            <span style={{ fontSize: '0.68rem', color: 'rgba(217,217,217,0.45)' }}>
              {card.publishedAt}
            </span>
          )}
        </div>

        {/* Title */}
        <h4
          style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#D9D9D9',
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: card.description ? '6px' : '10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {card.title}
        </h4>

        {card.description && (
          <p
            style={{
              fontSize: '0.76rem',
              lineHeight: 1.45,
              color: 'rgba(217,217,217,0.65)',
              marginBottom: '10px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {card.description}
          </p>
        )}

        {/* Footer */}
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
          <span style={{ color: 'rgba(217,217,217,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Play size={10} />
            Video Reference
          </span>
          <a
            href={card.videoUrl}
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
            Watch <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

