'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  FileText,
  BookMarked,
  MessageSquare,
  Video,
  Copy,
  Check,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import { useResearchStore } from '@/store/useResearchStore';
import { formatAllCitations } from '@/lib/utils';
import type { CitationFormat } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenVideoModal: () => void;
}

export function ReportDrawer({ isOpen, onClose, onOpenVideoModal }: Props) {
  const {
    report,
    citations,
    query,
    isStreaming,
    cards,
    activeDrawerTab,
    setActiveDrawerTab,
    setHighlightedCardId,
    setHighlightedCitation,
  } = useResearchStore();

  const [citationFormat, setCitationFormat] = useState<CitationFormat>('apa');
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedBib, setCopiedBib] = useState(false);

  // Q&A State
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCopyBib = () => {
    const formatted = formatAllCitations(citations, citationFormat);
    navigator.clipboard.writeText(formatted);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 2000);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputQuestion.trim();
    if (!q || isAsking) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInputQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/research/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context: report, question: q }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || 'No response generated.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to reach assistant. Please verify network connection.',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCitationClick = (index: number) => {
    setHighlightedCitation(index);
    const matchingCard = cards.find(
      (c) => c.type === 'source' && c.citationIndex === index
    );
    if (matchingCard) {
      setHighlightedCardId(matchingCard.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: 'min(640px, 92vw)',
            backgroundColor: '#1A0706',
            borderLeft: '1px solid rgba(85, 16, 13, 0.8)',
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(85, 16, 13, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              <TabButton
                icon={<FileText size={14} />}
                label="Report"
                active={activeDrawerTab === 'report'}
                onClick={() => setActiveDrawerTab('report')}
              />
              <TabButton
                icon={<BookMarked size={14} />}
                label={`Citations (${citations.length})`}
                active={activeDrawerTab === 'citations'}
                onClick={() => setActiveDrawerTab('citations')}
              />
              <TabButton
                icon={<MessageSquare size={14} />}
                label="Q&A"
                active={activeDrawerTab === 'qa'}
                onClick={() => setActiveDrawerTab('qa')}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={onOpenVideoModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #DD0200, #55100D)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: '#D9D9D9',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Video size={13} />
                Video
              </button>

              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(217,217,217,0.5)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
                title="Close drawer"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {/* TAB: REPORT */}
            {activeDrawerTab === 'report' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {isStreaming
                      ? 'Illuminating live synthesis…'
                      : `~${Math.max(1, Math.round(report.length / 1000))} min read`}
                  </span>

                  <button
                    onClick={handleCopyReport}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedReport ? <Check size={12} color="#DD0200" /> : <Copy size={12} />}
                    {copiedReport ? 'Copied' : 'Copy Markdown'}
                  </button>
                </div>

                {report ? (
                  <div className="markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        // Custom citation badge transformer
                        p({ children }) {
                          return <p>{children}</p>;
                        },
                        text({ node, ...props }) {
                          const content = String(props.children || '');
                          const parts = content.split(/(\[\d+\])/g);
                          if (parts.length > 1) {
                            return (
                              <>
                                {parts.map((part, i) => {
                                  const match = part.match(/^\[(\d+)\]$/);
                                  if (match) {
                                    const num = parseInt(match[1], 10);
                                    return (
                                      <button
                                        key={i}
                                        type="button"
                                        className="citation-ref"
                                        onClick={() => handleCitationClick(num)}
                                        title={`Jump to source [${num}]`}
                                      >
                                        {num}
                                      </button>
                                    );
                                  }
                                  return part;
                                })}
                              </>
                            );
                          }
                          return content;
                        },
                      }}
                    >
                      {report}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '60px 0',
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: '0.85rem',
                    }}
                  >
                    Synthesizing research report…
                  </div>
                )}
              </div>
            )}

            {/* TAB: CITATIONS */}
            {activeDrawerTab === 'citations' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(['apa', 'mla', 'bibtex'] as CitationFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setCitationFormat(fmt)}
                        style={{
                          background:
                            citationFormat === fmt
                              ? 'rgba(221,2,0,0.2)'
                              : 'transparent',
                          border:
                            citationFormat === fmt
                              ? '1px solid #DD0200'
                              : '1px solid rgba(217,217,217,0.12)',
                          color:
                            citationFormat === fmt
                              ? '#DD0200'
                              : 'rgba(217,217,217,0.6)',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                        }}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCopyBib}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(85,16,13,0.3)',
                      border: '1px solid rgba(85,16,13,0.6)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      color: 'rgba(217,217,217,0.7)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedBib ? <Check size={12} color="#DD0200" /> : <Copy size={12} />}
                    {copiedBib ? 'Copied' : 'Copy All'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {citations.map((c) => (
                    <div
                      key={c.index}
                      style={{
                        background: 'rgba(85,16,13,0.25)',
                        border: '1px solid rgba(85,16,13,0.6)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        fontSize: '0.8rem',
                        lineHeight: 1.45,
                        color: 'rgba(217,217,217,0.85)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: '#DD0200',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                          }}
                        >
                          [{c.index}]
                        </span>
                        <span style={{ fontWeight: 600, color: '#D9D9D9' }}>
                          {c.title}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'rgba(217,217,217,0.5)',
                          marginTop: '4px',
                        }}
                      >
                        {c.authors?.join(', ')} • {c.year ?? 2025} • {c.publisher ?? 'Journal'}
                      </div>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.72rem',
                          color: '#DD0200',
                          textDecoration: 'underline',
                          marginTop: '4px',
                          display: 'inline-block',
                        }}
                      >
                        {c.url}
                      </a>
                    </div>
                  ))}

                  {citations.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.3)',
                        padding: '40px 0',
                        fontSize: '0.85rem',
                      }}
                    >
                      Citations will populate as sources are verified.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: Q&A */}
            {activeDrawerTab === 'qa' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  {messages.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '40px 10px',
                        color: 'rgba(255,255,255,0.35)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <Sparkles
                        size={24}
                        color="#DD0200"
                        style={{ margin: '0 auto 10px', display: 'block' }}
                      />
                      Ask follow-up questions to delve deeper into this research synthesis.
                    </div>
                  )}

                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background:
                          m.role === 'user'
                            ? 'rgba(221,2,0,0.2)'
                            : 'rgba(85,16,13,0.35)',
                        border:
                          m.role === 'user'
                            ? '1px solid rgba(221,2,0,0.45)'
                            : '1px solid rgba(85,16,13,0.7)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: '#D9D9D9',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {m.text}
                    </div>
                  ))}

                  {isAsking && (
                    <div
                      style={{
                        alignSelf: 'flex-start',
                        color: '#DD0200',
                        fontSize: '0.8rem',
                        fontStyle: 'italic',
                      }}
                    >
                      Kryton is reasoning…
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleAskQuestion}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: 'auto',
                  }}
                >
                  <input
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    placeholder="Ask a question about this research…"
                    style={{
                      flex: 1,
                      background: 'rgba(85,16,13,0.35)',
                      border: '1px solid rgba(221,2,0,0.25)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#D9D9D9',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!inputQuestion.trim() || isAsking}
                    style={{
                      background: 'linear-gradient(135deg, #DD0200, #55100D)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0 16px',
                      color: '#D9D9D9',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(221,2,0,0.4)',
                    }}
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        background: active ? 'rgba(221,2,0,0.18)' : 'transparent',
        border: active
          ? '1px solid rgba(221,2,0,0.45)'
          : '1px solid transparent',
        color: active ? '#DD0200' : 'rgba(217,217,217,0.6)',
        fontSize: '0.78rem',
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.15s ease',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
