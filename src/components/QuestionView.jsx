import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
  Check, 
  RotateCcw, 
  Send, 
  HelpCircle,
  ZoomIn,
  X,
  Layers
} from 'lucide-react';

export default function QuestionView({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onClearAnswer,
  onToggleFlag,
  onNext,
  onPrev,
  onOpenSubmitModal
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const isFirst = questionIndex === 0;
  const isLast = questionIndex === totalQuestions - 1;

  // For questions with sub-items, selectedAnswer is an object { [subId]: 'أ' }
  const subAnswers = typeof selectedAnswer === 'object' && selectedAnswer !== null ? selectedAnswer : {};

  return (
    <div className="question-container animate-fade-in" key={question.id}>
      <div className="glass-panel question-card">
        {/* Card Header */}
        <div className="question-header">
          <div className="question-meta">
            <div className="question-number-pill">
              <HelpCircle size={15} />
              <span>السؤال {questionIndex + 1} من {totalQuestions}</span>
            </div>
            {question.topic && (
              <span className="topic-tag">{question.topic}</span>
            )}
            {question.hasSubQuestions && (
              <span 
                className="topic-tag" 
                style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Layers size={14} />
                <span>يحتوي على {question.subQuestions.length} فقرات</span>
              </span>
            )}
          </div>

          <button 
            type="button" 
            className={`flag-button ${isFlagged ? 'active' : ''}`}
            onClick={onToggleFlag}
            title={isFlagged ? 'إلغاء المراجعة' : 'تعليم السؤال للمراجعة لاحقاً'}
          >
            <Bookmark size={16} fill={isFlagged ? '#f59e0b' : 'transparent'} />
            <span>{isFlagged ? 'تم تمييزه للمراجعة' : 'تمييز للمراجعة'}</span>
          </button>
        </div>

        {/* Question Text (if provided) */}
        {question.question && (
          <h3 className="question-body">
            {question.question}
          </h3>
        )}

        {/* Question Image (for Math Exam 22 questions) */}
        {question.image && (
          <div className="question-image-container">
            <div 
              className="question-image-wrapper"
              onClick={() => setIsZoomed(true)}
              title="انقر لتكبير الصورة ملء الشاشة"
            >
              <img 
                src={question.image} 
                alt={`سؤال رقم ${questionIndex + 1}`} 
                className="question-img" 
                loading="eager"
              />
              <div className="zoom-hint">
                <ZoomIn size={16} />
                <span>انقر للتكبير</span>
              </div>
            </div>
          </div>
        )}

        {/* Render Sub-questions (e.g. Question 20 has 5 parts, Question 22 has 2 parts) */}
        {question.hasSubQuestions ? (
          <div className="sub-questions-container">
            <div className="options-selection-title" style={{ color: '#818cf8', fontSize: '1.05rem', marginBottom: '1rem' }}>
              📍 يرجى الإجابة على جميع فقرات هذا السؤال ({question.subQuestions.length} فقرات):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {question.subQuestions.map((sub) => {
                const currentSubAns = subAnswers[sub.subId];
                return (
                  <div key={sub.subId} className="sub-question-row">
                    <div className="sub-question-title">
                      <span className="sub-badge">{sub.subId}</span>
                      <span>{sub.title}</span>
                    </div>

                    <div className="options-grid-math" style={{ marginTop: '0.6rem' }}>
                      {sub.options.map((opt) => {
                        const isSelected = currentSubAns === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={`option-btn-math ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelectAnswer(opt.id, sub.subId)}
                          >
                            <div className="option-badge-math">
                              {isSelected ? <Check size={20} strokeWidth={3} /> : opt.id}
                            </div>
                            <div className="option-label-math">
                              {opt.label || opt.text || `(${opt.id})`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Standard Single-part Question */
          <>
            <div className="options-selection-title">
              اختر الإجابة الصحيحة:
            </div>

            <div className="options-grid-math">
              {question.options.map((opt) => {
                const isSelected = selectedAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`option-btn-math ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectAnswer(opt.id)}
                  >
                    <div className="option-badge-math">
                      {isSelected ? <Check size={20} strokeWidth={3} /> : opt.id}
                    </div>
                    <div className="option-label-math">
                      {opt.label || opt.text || `الخيار (${opt.id})`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clear Option Button */}
            {selectedAnswer && (
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => onClearAnswer()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-sub)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <RotateCcw size={14} />
                  <span>إلغاء تحديد الإجابة</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="question-footer">
        {/* Right side (RTL Previous) */}
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onPrev}
          disabled={isFirst}
        >
          <ChevronRight size={20} />
          <span>السؤال السابق</span>
        </button>

        {/* Left side (Next or Submit) */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!isLast ? (
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onNext}
            >
              <span>السؤال التالي</span>
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-success" 
              onClick={onOpenSubmitModal}
            >
              <Send size={18} />
              <span>مراجعة وتسليم الاختبار</span>
            </button>
          )}
        </div>
      </div>

      {/* Zoom / Lightbox Modal */}
      {isZoomed && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsZoomed(false)}>
          <div 
            className="zoomed-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              className="close-zoom-btn"
              onClick={() => setIsZoomed(false)}
            >
              <X size={24} />
            </button>
            <img 
              src={question.image} 
              alt={`سؤال ${questionIndex + 1} مكبر`}
              className="zoomed-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}
