import React from 'react';
import { LayoutGrid, Bookmark, CheckCircle, Clock, X } from 'lucide-react';

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answers,
  flags,
  onSelectQuestion,
  onOpenSubmitModal,
  isMobileOpen,
  onCloseMobile
}) {
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flags).filter(Boolean).length;
  const remainingCount = totalQuestions - answeredCount;

  return (
    <aside className={`sidebar-panel ${isMobileOpen ? 'mobile-open animate-fade-in' : ''}`}>
      <div className="glass-panel palette-card">
        {/* Header */}
        <div className="palette-header">
          <div className="palette-title">
            <LayoutGrid size={18} color="#818cf8" />
            <span>خريطة الأسئلة (1 - {totalQuestions})</span>
          </div>

          {isMobileOpen && (
            <button 
              type="button" 
              onClick={onCloseMobile}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="legend-grid">
          <div className="legend-item">
            <div className="legend-dot answered" />
            <span>تمت الإجابة ({answeredCount})</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot flagged" />
            <span>للمراجعة ({flaggedCount})</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot current" />
            <span>السؤال الحالي</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot unanswered" />
            <span>لم تتم الإجابة ({remainingCount})</span>
          </div>
        </div>

        {/* 1..25 Matrix */}
        <div className="questions-matrix">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const qNum = idx + 1;
            const isCurrent = idx === currentIndex;
            const ansVal = answers[idx];
            const isAnswered = ansVal !== undefined && ansVal !== null && (typeof ansVal !== 'object' || Object.keys(ansVal).length > 0);
            const isFlagged = Boolean(flags[idx]);

            let classes = 'matrix-btn';
            if (isCurrent) classes += ' current';
            if (isAnswered) classes += ' answered';
            if (isFlagged) classes += ' flagged';

            return (
              <button
                key={idx}
                type="button"
                className={classes}
                onClick={() => {
                  onSelectQuestion(idx);
                  if (onCloseMobile) onCloseMobile();
                }}
                title={`الانتقال للسؤال ${qNum}`}
              >
                {qNum}
                {isFlagged && <span className="flag-indicator-dot" />}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="palette-stats">
          <span>التقدم الإجمالي:</span>
          <strong style={{ color: '#34d399' }}>
            {Math.round((answeredCount / totalQuestions) * 100)}%
          </strong>
        </div>

        <button 
          type="button" 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            onOpenSubmitModal();
          }}
        >
          <span>تسليم ومراجعة الاختبار</span>
        </button>
      </div>
    </aside>
  );
}
