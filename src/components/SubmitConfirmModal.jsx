import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Bookmark, X } from 'lucide-react';

export default function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  flaggedCount,
  timeLeftFormatted
}) {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="glass-panel modal-card">
        <div 
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: unansweredCount > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: unansweredCount > 0 ? '#f59e0b' : '#10b981',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff' }}>
          تأكيد تسليم الامتحان
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          يرجى مراجعة ملخص إجاباتك قبل التسليم النهائي:
        </p>

        {/* Summary Card */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid var(--border-glass)',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            textAlign: 'right'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="#34d399" />
              الأسئلة المجاب عليها:
            </span>
            <strong style={{ color: '#34d399' }}>{answeredCount} من {totalQuestions}</strong>
          </div>

          {unansweredCount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={16} color="#f87171" />
                أسئلة لم تتم الإجابة عليها:
              </span>
              <strong style={{ color: '#f87171' }}>{unansweredCount} سؤال</strong>
            </div>
          )}

          {flaggedCount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bookmark size={16} color="#fbbf24" />
                أسئلة معلّمة للمراجعة:
              </span>
              <strong style={{ color: '#fbbf24' }}>{flaggedCount} سؤال</strong>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="#38bdf8" />
              الوقت المتبقي:
            </span>
            <strong style={{ color: '#38bdf8', direction: 'ltr' }}>{timeLeftFormatted}</strong>
          </div>
        </div>

        {/* Warning text */}
        <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          ⚠️ <strong>تنبيه نهائي:</strong> بمجرد الضغط على تأكيد التسليم، سيتم رصد درجتك وقفل الامتحان نهائياً ولن تتمكن من الدخول مجدداً.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
            style={{ flex: 1 }}
          >
            الرجوع ومتابعة الحل
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            تأكيد التسليم الآن
          </button>
        </div>
      </div>
    </div>
  );
}
