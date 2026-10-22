import React from 'react';
import { Clock, User, Send, LayoutGrid, AlertCircle } from 'lucide-react';
import { EXAM_CONFIG } from '../data/questions';

export default function ExamHeader({ 
  student, 
  timeLeftSeconds, 
  totalAnswered, 
  totalQuestions, 
  onOpenSubmitModal,
  onToggleMobilePalette,
  isMobilePaletteOpen 
}) {
  // Format seconds into HH:MM:SS or MM:SS
  const formatTime = (seconds) => {
    if (seconds < 0) seconds = 0;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Determine timer warning level
  const getTimerClass = () => {
    if (timeLeftSeconds <= 300) return 'danger'; // under 5 minutes
    if (timeLeftSeconds <= 900) return 'warning'; // under 15 minutes
    return 'normal';
  };

  const progressPercent = Math.round((totalAnswered / totalQuestions) * 100);

  return (
    <header className="exam-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-icon">
            <span style={{ fontSize: '1.4rem' }}>∑</span>
          </div>
          <div>
            <h2 className="brand-title">{EXAM_CONFIG.title}</h2>
            <p className="brand-subtitle">{EXAM_CONFIG.subject} • {totalQuestions} سؤالاً</p>
          </div>
        </div>

        {/* Center / Actions */}
        <div className="nav-actions">
          {/* Student Info */}
          <div className="student-badge">
            <User size={16} color="#818cf8" />
            <span>الطالب: <strong>{student.name}</strong></span>
          </div>

          {/* Timer */}
          <div className={`timer-pill ${getTimerClass()}`} title="الوقت المتبقي للاختبار">
            <Clock size={18} />
            <span dir="ltr">{formatTime(timeLeftSeconds)}</span>
          </div>

          {/* Mobile Sheet Toggle */}
          <button 
            type="button" 
            className="btn btn-secondary mobile-palette-toggle" 
            onClick={onToggleMobilePalette}
            aria-label="قائمة الأسئلة"
          >
            <LayoutGrid size={18} />
            <span>{totalAnswered}/{totalQuestions}</span>
          </button>

          {/* Quick Submit */}
          <button 
            type="button" 
            className="btn btn-success" 
            onClick={onOpenSubmitModal}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <Send size={16} />
            <span>تسليم الامتحان</span>
          </button>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="progress-container" style={{ marginTop: '0.65rem' }}>
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercent}%` }}
          title={`تمت الإجابة على ${totalAnswered} من ${totalQuestions} (${progressPercent}%)`}
        />
      </div>
    </header>
  );
}
