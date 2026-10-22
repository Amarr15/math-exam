import React, { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { EXAM_CONFIG } from '../data/questions';

export default function StudentLogin({ onStartExam, alreadyCompletedData, onAdminReset }) {
  const [studentName, setStudentName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [error, setError] = useState('');
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || studentName.trim().length < 3) {
      setError('يرجى إدخال اسم الطالب ثلاثي أو رباعي بشكل صحيح.');
      return;
    }
    setError('');
    onStartExam({
      name: studentName.trim(),
      code: studentCode.trim() || 'STU-' + Math.floor(1000 + Math.random() * 9000),
      startTime: Date.now()
    });
  };

  const handleAdminReset = (e) => {
    e.preventDefault();
    if (adminPass === EXAM_CONFIG.adminBypassKey) {
      onAdminReset();
      setShowAdminPrompt(false);
      setAdminPass('');
      setAdminError('');
    } else {
      setAdminError('كلمة المرور غير صحيحة!');
    }
  };

  // If already locked / completed
  if (alreadyCompletedData) {
    return (
      <div className="welcome-overlay animate-fade-in">
        <div className="glass-panel welcome-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div className="welcome-hero-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
            <AlertTriangle size={38} />
          </div>

          <h2 className="welcome-title" style={{ color: '#fca5a5' }}>
            عفواً، لا يمكنك دخول الامتحان مرة أخرى
          </h2>

          <p className="welcome-subtitle">
            سجل النظام أن الطالب <strong>{alreadyCompletedData.student?.name}</strong> قد أتم هذا الاختبار مسبقاً.
          </p>

          <div className="rules-list">
            <div className="rule-item">
              <CheckCircle2 size={18} color="#34d399" />
              <span>تاريخ وتوقيت التسليم: {alreadyCompletedData.submittedAtFormatted || 'سابقاً'}</span>
            </div>
            <div className="rule-item">
              <CheckCircle2 size={18} color="#34d399" />
              <span>الدرجة المسجلة: {alreadyCompletedData.score} من {alreadyCompletedData.totalQuestions} ({alreadyCompletedData.percentage}%)</span>
            </div>
            <div className="rule-item">
              <ShieldCheck size={18} color="#60a5fa" />
              <span>نظام الأمان يمنع تكرار المحاولة لضمان النزاهة والعدالة.</span>
            </div>
          </div>

          {/* Admin bypass for teacher testing */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              type="button" 
              onClick={() => setShowAdminPrompt(!showAdminPrompt)}
              style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              (خاص بالمعلم / المشرف: إعادة تعيين المحاولة للتجربة)
            </button>

            {showAdminPrompt && (
              <form onSubmit={handleAdminReset} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <input 
                  type="password"
                  placeholder="كلمة مرور المشرف (reset2026)"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="text-input"
                  style={{ width: '220px', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  تصفير
                </button>
              </form>
            )}
            {adminError && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem' }}>{adminError}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-overlay animate-fade-in">
      <div className="glass-panel welcome-card">
        <div className="welcome-hero-icon">
          <GraduationCap size={40} />
        </div>

        <h1 className="welcome-title">{EXAM_CONFIG.title}</h1>
        <p className="welcome-subtitle">{EXAM_CONFIG.subject} | منصة التقييم الإلكتروني</p>

        <div className="rules-list">
          <div className="rule-item">
            <Clock size={18} color="#38bdf8" />
            <span>مدة الامتحان: <strong>{EXAM_CONFIG.durationMinutes} دقيقة</strong> متواصلة من لحظة الضغط على البدء.</span>
          </div>
          <div className="rule-item">
            <HelpCircle size={18} color="#a78bfa" />
            <span>عدد الأسئلة: <strong>{EXAM_CONFIG.totalQuestions} سؤالاً</strong> موضوعياً (اختيار من متعدد).</span>
          </div>
          <div className="rule-item" style={{ color: '#fbbf24' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <span><strong>تنبيه صارم:</strong> الدخول متاح <strong>لمرة واحدة فقط</strong>، ولا يمكن إعادة الامتحان نهائياً بعد الخروج أو التسليم.</span>
          </div>
          <div className="rule-item">
            <ShieldCheck size={18} color="#34d399" />
            <span>يتم حفظ جميع إجاباتك وموقعك بالسؤال تلقائياً لحظة بلحظة.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="studentName">
              الاسم الكامل للطالب <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="studentName"
              type="text"
              className="text-input"
              placeholder="اكتب اسمك الثلاثي أو الرباعي هنا..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="studentCode">
              رقم الجلوس / كود الطالب (اختياري)
            </label>
            <input
              id="studentCode"
              type="text"
              className="text-input"
              placeholder="مثال: 2026105"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: '600' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            <span>بدء الامتحان الآن</span>
            <ArrowLeft size={20} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => setShowAdminPrompt(!showAdminPrompt)}
            style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            إعدادات المشرف والتجربة
          </button>

          {showAdminPrompt && (
            <form onSubmit={handleAdminReset} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <input 
                type="password"
                placeholder="كلمة سر المشرف: reset2026"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="text-input"
                style={{ width: '200px', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                تصفير السجلات
              </button>
            </form>
          )}
          {adminError && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem' }}>{adminError}</p>}
        </div>
      </div>
    </div>
  );
}
