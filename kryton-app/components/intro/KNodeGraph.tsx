'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

// K node positions (normalized -1 to 1 space)
// Forms the letter K: vertical bar left, two diagonals right
const K_NODES = [
  { id: 'k1', x: -0.5, y:  0.7 },  // top-left of vertical bar
  { id: 'k2', x: -0.5, y:  0.0 },  // middle of vertical bar
  { id: 'k3', x: -0.5, y: -0.7 },  // bottom of vertical bar
  { id: 'k4', x:  0.4, y:  0.7 },  // top-right diagonal
  { id: 'k5', x:  0.4, y: -0.7 },  // bottom-right diagonal
];

const K_EDGES = [
  [0, 1], // vertical bar top segment
  [1, 2], // vertical bar bottom segment
  [1, 3], // upper diagonal arm
  [1, 4], // lower diagonal arm
];

const NODE_R = 8;
const CANVAS_SIZE = 320;
const CENTER = CANVAS_SIZE / 2;
const SCALE = 110;

function toCanvas(nx: number, ny: number) {
  return {
    cx: CENTER + nx * SCALE,
    cy: CENTER - ny * SCALE,
  };
}

export function KNodeGraph({ onComplete }: Props) {
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const DURATION = 3800; // ms total

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      progressRef.current = t;

      const svg = svgRef.current;
      if (!svg) return;

      // Phase 0→0.15: single node fades in at center
      // Phase 0.15→0.45: nodes expand outward to K positions
      // Phase 0.45→0.75: edges draw in
      // Phase 0.75→1.0: glow halos pulse, wordmark appears

      // Nodes
      K_NODES.forEach((node, i) => {
        const el = svg.querySelector(`[data-node="${node.id}"]`);
        if (!el) return;

        const expandStart = 0.15 + i * 0.04;
        const expandEnd = expandStart + 0.15;
        const nodeT = Math.max(0, Math.min(1, (t - expandStart) / (expandEnd - expandStart)));
        const eased = easeOutBack(nodeT);

        const target = toCanvas(node.x, node.y);
        const cx = CENTER + (target.cx - CENTER) * eased;
        const cy = CENTER + (target.cy - CENTER) * eased;
        const opacity = Math.max(0, Math.min(1, (t - 0.1) / 0.15));

        (el as SVGCircleElement).setAttribute('cx', String(cx));
        (el as SVGCircleElement).setAttribute('cy', String(cy));
        (el as SVGCircleElement).style.opacity = String(opacity);

        // Glow halo
        const halo = svg.querySelector(`[data-halo="${node.id}"]`);
        if (halo) {
          (halo as SVGCircleElement).setAttribute('cx', String(cx));
          (halo as SVGCircleElement).setAttribute('cy', String(cy));
          const haloOpacity = t > 0.75 ? Math.sin((t - 0.75) * Math.PI * 3) * 0.3 : 0;
          (halo as SVGCircleElement).style.opacity = String(haloOpacity);
        }
      });

      // Edges — draw in after nodes
      K_EDGES.forEach(([aIdx, bIdx], i) => {
        const edgeEl = svg.querySelector(`[data-edge="${i}"]`);
        if (!edgeEl) return;

        const edgeStart = 0.45 + i * 0.06;
        const edgeT = Math.max(0, Math.min(1, (t - edgeStart) / 0.12));
        const eased = easeInOutCubic(edgeT);

        const a = toCanvas(K_NODES[aIdx].x, K_NODES[aIdx].y);
        const b = toCanvas(K_NODES[bIdx].x, K_NODES[bIdx].y);

        const x2 = a.cx + (b.cx - a.cx) * eased;
        const y2 = a.cy + (b.cy - a.cy) * eased;

        (edgeEl as SVGLineElement).setAttribute('x1', String(a.cx));
        (edgeEl as SVGLineElement).setAttribute('y1', String(a.cy));
        (edgeEl as SVGLineElement).setAttribute('x2', String(x2));
        (edgeEl as SVGLineElement).setAttribute('y2', String(y2));
        (edgeEl as SVGLineElement).style.opacity = edgeT > 0 ? '1' : '0';
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  const nodes = K_NODES.map((n) => toCanvas(n.x, n.y));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      <svg
        ref={svgRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="halo-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E6BFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1E6BFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {K_EDGES.map((_, i) => (
          <line
            key={i}
            data-edge={i}
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={CENTER}
            stroke="#1E6BFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0"
            filter="url(#glow-filter)"
          />
        ))}

        {/* Halo circles */}
        {K_NODES.map((node, i) => (
          <circle
            key={`halo-${i}`}
            data-halo={node.id}
            cx={CENTER}
            cy={CENTER}
            r={NODE_R * 4}
            fill="url(#halo-grad)"
            opacity="0"
          />
        ))}

        {/* Nodes */}
        {K_NODES.map((node, i) => (
          <circle
            key={node.id}
            data-node={node.id}
            cx={CENTER}
            cy={CENTER}
            r={NODE_R}
            fill="#FFFFFF"
            opacity="0"
            filter="url(#node-glow)"
          />
        ))}
      </svg>

      {/* Wordmark — fades in at t>0.7 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <div
          className="brand-title"
          style={{
            fontSize: '2.5rem',
            letterSpacing: '0.18em',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #1E6BFF 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
          }}
        >
          KRYTON
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.5 }}
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.85rem',
            letterSpacing: '0.25em',
            fontFamily: "'Inter', sans-serif",
            marginTop: '4px',
          }}
        >
          RESEARCH, ILLUMINATED.
        </motion.p>
      </motion.div>
    </div>
  );
}

// ── Easing functions ────────────────────────────────────────

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
