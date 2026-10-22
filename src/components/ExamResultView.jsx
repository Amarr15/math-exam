import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lock, 
  User, 
  Printer, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  HelpCircle,
  ZoomIn
} from 'lucide-react';
import { EXAM_CONFIG } from '../data/questions';

export default function ExamResultView({ resultData, questions, onAdminReset }) {
  const [showReview, setShowReview] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const isPassed = resultData.percentage >= EXAM_CONFIG.passingScorePercent;

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback
      }
    }
  }, [isPassed]);

  const handleAdminReset = (e) => {
    e.preventDefault();
    if (adminPass === EXAM_CONFIG.adminBypassKey) {
      onAdminReset();
    } else {
      setAdminError('كلمة المرور غير صحيحة!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="exam-layout animate-fade-in" style={{ gridTemplateColumns: '1fr', maxWidth: '850px' }}>
      <div className="glass-panel result-card">
        {/* Top Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '9999px',
            background: isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isPassed ? '#34d399' : '#f87171',
            border: `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            marginBottom: '1rem',
            fontWeight: '700'
          }}
        >
          <Award size={18} />
          <span>{isPassed ? 'تم اجتياز الاختبار بنجاح' : 'لم يتم اجتياز الاختبار'}</span>
        </div>

        <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#fff', marginBottom: '0.4rem' }}>
          نتيجة {EXAM_CONFIG.title}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          اسم الطالب: <strong style={{ color: '#fff' }}>{resultData.student?.name}</strong> • كود: {resultData.student?.code}
        </p>

        {/* Big Score Circle */}
        <div 
          className="score-circle" 
          style={{ 
            borderColor: isPassed ? 'var(--success)' : 'var(--danger)',
            boxShadow: isPassed ? '0 0 35px var(--success-glow)' : '0 0 35px var(--danger-glow)'
          }}
        >
          <span className="score-number">{resultData.score}</span>
          <span className="score-total">من {resultData.totalQuestions} ({resultData.percentage}%)</span>
        </div>

        {/* Quick Stats Grid */}
        <div className="result-stats-row">
          <div className="stat-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#34d399' }}>
              <CheckCircle2 size={18} />
              <span>إجابات صحيحة</span>
            </div>
            <div className="stat-value" style={{ color: '#34d399' }}>{resultData.correctCount}</div>
          </div>

          <div className="stat-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#f87171' }}>
              <XCircle size={18} />
              <span>إجابات خاطئة</span>
            </div>
            <div className="stat-value" style={{ color: '#f87171' }}>{resultData.wrongCount}</div>
          </div>

          <div className="stat-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#38bdf8' }}>
              <Clock size={18} />
              <span>الوقت المستغرق</span>
            </div>
            <div className="stat-value" style={{ color: '#38bdf8' }}>{resultData.timeTakenFormatted}</div>
          </div>
        </div>

        {/* Enforced Single Attempt Lock Banner */}
        <div className="lock-banner">
          <Lock size={20} />
          <span>تم تسجيل النتيجة وتأمين الاختبار. لا يمكن إعادة الدخول لهذا الامتحان مرة أخرى من هذا الجهاز.</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handlePrint}
          >
            <Printer size={18} />
            <span>طباعة شهادة / ملخص النتيجة</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setShowReview(!showReview)}
          >
            {showReview ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            <span>{showReview ? 'إخفاء مراجعة الإجابات' : 'عرض مراجعة الأسئلة والإجابات النموذجية'}</span>
          </button>
        </div>

        {/* Detailed Question Review Section */}
        {showReview && (
          <div style={{ marginTop: '2.5rem', textAlign: 'right' }} className="animate-fade-in">
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.25rem', color: '#fff', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              مراجعة وتفاصيل الإجابات ({resultData.rawQuestionsCount || questions.length} سؤالاً - {resultData.totalQuestions} درجة):
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {questions.map((q, idx) => {
                const studentAns = resultData.answers[idx];

                if (q.hasSubQuestions) {
                  return (
                    <div 
                      key={q.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '700', color: '#fff' }}>السؤال {idx + 1}: {q.topic} ({q.subQuestions.length} فقرات)</span>
                      </div>

                      {q.image && (
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '0.5rem', marginBottom: '0.85rem', display: 'flex', justifyContent: 'center' }}>
                          <img 
                            src={q.image} 
                            alt={`سؤال ${idx + 1}`} 
                            style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }} 
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                        {q.subQuestions.map((sub) => {
                          const subAns = studentAns && typeof studentAns === 'object' ? studentAns[sub.subId] : null;
                          const isSubCorrect = subAns === sub.correctAnswer;
                          const isSubSkipped = !subAns;

                          return (
                            <div 
                              key={sub.subId}
                              style={{
                                background: 'rgba(0, 0, 0, 0.25)',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: `1px solid ${isSubCorrect ? 'rgba(16, 185, 129, 0.4)' : isSubSkipped ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.4)'}`
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <span style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '0.95rem' }}>{sub.title}</span>
                                <span 
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '4px',
                                    background: isSubCorrect ? 'rgba(16, 185, 129, 0.2)' : isSubSkipped ? 'rgba(148, 163, 184, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: isSubCorrect ? '#34d399' : isSubSkipped ? '#94a3b8' : '#f87171'
                                  }}
                                >
                                  {isSubCorrect ? 'صحيحة' : isSubSkipped ? 'لم تُجب' : 'خاطئة'}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.88rem', display: 'flex', gap: '1.5rem' }}>
                                <span>إجابتك: <strong style={{ color: isSubCorrect ? '#34d399' : '#f87171' }}>{subAns ? `( ${subAns} )` : 'لم تُجب'}</strong></span>
                                <span>الإجابة الصحيحة: <strong style={{ color: '#34d399' }}>( {sub.correctAnswer} )</strong></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                const isCorrect = studentAns === q.correctAnswer;
                const isSkipped = !studentAns;

                return (
                  <div 
                    key={q.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.35)' : isSkipped ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.35)'}`,
                      borderRadius: '16px',
                      padding: '1.25rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '700', color: '#fff' }}>السؤال {idx + 1}: {q.topic}</span>
                      <span 
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          background: isCorrect ? 'rgba(16, 185, 129, 0.2)' : isSkipped ? 'rgba(148, 163, 184, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: isCorrect ? '#34d399' : isSkipped ? '#94a3b8' : '#f87171'
                        }}
                      >
                        {isCorrect ? 'إجابة صحيحة' : isSkipped ? 'لم تتم الإجابة' : 'إجابة خاطئة'}
                      </span>
                    </div>

                    {/* Question image */}
                    {q.image && (
                      <div style={{ background: '#fff', borderRadius: '12px', padding: '0.5rem', marginBottom: '0.85rem', display: 'flex', justifyContent: 'center' }}>
                        <img 
                          src={q.image} 
                          alt={`سؤال ${idx + 1}`} 
                          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                        />
                      </div>
                    )}

                    {q.question && (
                      <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '0.6rem' }}>{q.question}</p>
                    )}

                    <div style={{ fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                      <div>
                        إجابتك: <strong style={{ color: isCorrect ? '#34d399' : '#f87171' }}>
                          {studentAns ? `الخيار ( ${studentAns} )` : 'لم تُجب'}
                        </strong>
                      </div>
                      <div>
                        الإجابة الصحيحة: <strong style={{ color: '#34d399' }}>
                          الخيار ( {q.correctAnswer} )
                        </strong>
                      </div>
                      {q.explanation && (
                        <div style={{ marginTop: '0.35rem', color: '#94a3b8', fontSize: '0.85rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                          💡 <strong>التفسير:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Teacher / Admin Testing Reset Link */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.25rem' }}>
          <button 
            type="button" 
            onClick={() => setShowAdminPrompt(!showAdminPrompt)}
            style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            (للمشرف: تصفير النتيجة لإعادة التجربة)
          </button>

          {showAdminPrompt && (
            <form onSubmit={handleAdminReset} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <input 
                type="password"
                placeholder="كلمة مرور المشرف (reset2026)"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="text-input"
                style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-outline-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                تصفير المحاولة
              </button>
            </form>
          )}
          {adminError && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem' }}>{adminError}</p>}
        </div>
      </div>
    </div>
  );
}
