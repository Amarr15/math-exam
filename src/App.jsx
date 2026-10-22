import React, { useState, useEffect } from 'react';
import StudentLogin from './components/StudentLogin';
import ExamHeader from './components/ExamHeader';
import QuestionView from './components/QuestionView';
import QuestionPalette from './components/QuestionPalette';
import SubmitConfirmModal from './components/SubmitConfirmModal';
import ExamResultView from './components/ExamResultView';
import { EXAM_CONFIG, INITIAL_QUESTIONS } from './data/questions';

const STORAGE_KEYS = {
  STATUS: 'math_exam_status_v2',
  STUDENT: 'math_exam_student_v2',
  END_TIME: 'math_exam_end_time_v2',
  START_TIME: 'math_exam_start_time_v2',
  ANSWERS: 'math_exam_answers_v2',
  FLAGS: 'math_exam_flags_v2',
  RESULT: 'math_exam_result_v2'
};

export default function App() {
  const [examStatus, setExamStatus] = useState('loading'); // 'not_started' | 'in_progress' | 'completed'
  const [student, setStudent] = useState(null);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_CONFIG.durationMinutes * 60);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [resultData, setResultData] = useState(null);

  // Initialize and check persistent storage
  useEffect(() => {
    try {
      const savedStatus = localStorage.getItem(STORAGE_KEYS.STATUS);
      const savedStudent = localStorage.getItem(STORAGE_KEYS.STUDENT);
      const savedResult = localStorage.getItem(STORAGE_KEYS.RESULT);

      if (savedStatus === 'completed' && savedResult) {
        setResultData(JSON.parse(savedResult));
        setStudent(savedStudent ? JSON.parse(savedStudent) : null);
        setExamStatus('completed');
        return;
      }

      if (savedStatus === 'in_progress' && savedStudent) {
        const parsedStudent = JSON.parse(savedStudent);
        const endTime = parseInt(localStorage.getItem(STORAGE_KEYS.END_TIME) || '0', 10);
        const now = Date.now();

        if (endTime && now >= endTime) {
          // Time expired while away -> auto submit
          const savedAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');
          calculateAndFinalizeResults(parsedStudent, savedAnswers, true);
          return;
        }

        // Still active
        const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remainingSeconds);
        setStudent(parsedStudent);
        setAnswers(JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}'));
        setFlags(JSON.parse(localStorage.getItem(STORAGE_KEYS.FLAGS) || '{}'));
        setExamStatus('in_progress');
        return;
      }

      setExamStatus('not_started');
    } catch (e) {
      console.error('Storage initialization error:', e);
      setExamStatus('not_started');
    }
  }, []);

  // Timer countdown loop
  useEffect(() => {
    if (examStatus !== 'in_progress') return;

    const timer = setInterval(() => {
      const endTime = parseInt(localStorage.getItem(STORAGE_KEYS.END_TIME) || '0', 10);
      if (!endTime) return;

      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        // Auto submit exam upon timeout!
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examStatus, answers, student]);

  // Start exam action
  const handleStartExam = (studentData) => {
    const durationSeconds = EXAM_CONFIG.durationMinutes * 60;
    const now = Date.now();
    const endTime = now + durationSeconds * 1000;

    localStorage.setItem(STORAGE_KEYS.STATUS, 'in_progress');
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(studentData));
    localStorage.setItem(STORAGE_KEYS.START_TIME, now.toString());
    localStorage.setItem(STORAGE_KEYS.END_TIME, endTime.toString());
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify({}));
    localStorage.setItem(STORAGE_KEYS.FLAGS, JSON.stringify({}));

    setStudent(studentData);
    setTimeLeft(durationSeconds);
    setAnswers({});
    setFlags({});
    setCurrentQuestionIndex(0);
    setExamStatus('in_progress');
  };

  // Select / Answer Question (Supports both single questions and sub-questions)
  const handleSelectAnswer = (optionId, subId = null) => {
    let updated;
    if (subId !== null && subId !== undefined) {
      const currentSub = (typeof answers[currentQuestionIndex] === 'object' && answers[currentQuestionIndex] !== null) 
        ? answers[currentQuestionIndex] 
        : {};
      updated = {
        ...answers,
        [currentQuestionIndex]: {
          ...currentSub,
          [subId]: optionId
        }
      };
    } else {
      updated = {
        ...answers,
        [currentQuestionIndex]: optionId
      };
    }

    setAnswers(updated);
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(updated));
  };

  // Clear answer
  const handleClearAnswer = (subId = null) => {
    let updated = { ...answers };
    if (subId !== null && typeof updated[currentQuestionIndex] === 'object') {
      const currentSub = { ...updated[currentQuestionIndex] };
      delete currentSub[subId];
      updated[currentQuestionIndex] = currentSub;
    } else {
      delete updated[currentQuestionIndex];
    }
    setAnswers(updated);
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(updated));
  };

  // Toggle flag for question
  const handleToggleFlag = () => {
    const updated = { ...flags, [currentQuestionIndex]: !flags[currentQuestionIndex] };
    setFlags(updated);
    localStorage.setItem(STORAGE_KEYS.FLAGS, JSON.stringify(updated));
  };

  // Auto Submit on Timer Expiration
  const handleAutoSubmit = () => {
    setIsSubmitModalOpen(false);
    calculateAndFinalizeResults(student, answers, true);
  };

  // Manual Submit Confirm
  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    calculateAndFinalizeResults(student, answers, false);
  };

  // Calculate scores and permanently lock
  const calculateAndFinalizeResults = (currentStudent, currentAnswers, isTimeout) => {
    let earnedPoints = 0;
    let totalPoints = 0;

    questions.forEach((q, idx) => {
      const ans = currentAnswers[idx];
      if (q.hasSubQuestions) {
        q.subQuestions.forEach((sub) => {
          totalPoints += 1;
          if (ans && typeof ans === 'object' && ans[sub.subId] === sub.correctAnswer) {
            earnedPoints += 1;
          }
        });
      } else {
        totalPoints += 1;
        if (ans === q.correctAnswer) {
          earnedPoints += 1;
        }
      }
    });

    const wrongCount = totalPoints - earnedPoints;
    const percentage = Math.round((earnedPoints / totalPoints) * 100);

    const startTime = parseInt(localStorage.getItem(STORAGE_KEYS.START_TIME) || '0', 10) || Date.now();
    const timeSpentMs = Math.max(0, Date.now() - startTime);
    const spentMins = Math.floor(timeSpentMs / 60000);
    const spentSecs = Math.floor((timeSpentMs % 60000) / 1000);
    const timeTakenFormatted = `${spentMins} دقيقة و ${spentSecs} ثانية`;

    const result = {
      score: earnedPoints,
      totalQuestions: totalPoints, // Total points e.g. 27
      rawQuestionsCount: questions.length, // 22 questions
      percentage,
      correctCount: earnedPoints,
      wrongCount,
      timeTakenFormatted,
      isTimeout,
      submittedAtFormatted: new Date().toLocaleTimeString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      student: currentStudent,
      answers: currentAnswers
    };

    // Permanently save result and mark status completed
    localStorage.setItem(STORAGE_KEYS.STATUS, 'completed');
    localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));

    setResultData(result);
    setExamStatus('completed');
  };

  // Helper: Is a question fully or partially answered?
  const isQuestionAnswered = (idx) => {
    const q = questions[idx];
    const ans = answers[idx];
    if (!ans) return false;
    if (q.hasSubQuestions) {
      if (typeof ans !== 'object') return false;
      // Fully answered if all sub-questions are answered
      return q.subQuestions.every((sub) => Boolean(ans[sub.subId]));
    }
    return Boolean(ans);
  };

  // Count fully answered questions
  const fullyAnsweredCount = questions.filter((_, idx) => isQuestionAnswered(idx)).length;

  // Admin Reset
  const handleAdminReset = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    setStudent(null);
    setAnswers({});
    setFlags({});
    setResultData(null);
    setCurrentQuestionIndex(0);
    setTimeLeft(EXAM_CONFIG.durationMinutes * 60);
    setExamStatus('not_started');
  };

  if (examStatus === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary-light)', fontSize: '1.2rem', fontWeight: '700' }}>
          جاري تحميل منصة الاختبار...
        </div>
      </div>
    );
  }

  // Entrance Screen (Login or Already Done)
  if (examStatus === 'not_started') {
    return (
      <StudentLogin 
        onStartExam={handleStartExam} 
        onAdminReset={handleAdminReset}
      />
    );
  }

  // Result / Completed Screen (Locked)
  if (examStatus === 'completed' && resultData) {
    return (
      <ExamResultView 
        resultData={resultData} 
        questions={questions}
        onAdminReset={handleAdminReset}
      />
    );
  }

  // Active Exam Flow
  const currentQ = questions[currentQuestionIndex];
  const flaggedCount = Object.values(flags).filter(Boolean).length;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const pad = (n) => String(n).padStart(2, '0');
  const timeLeftFormatted = `${pad(mins)}:${pad(secs)}`;

  return (
    <div className="app-container">
      {/* Top Fixed Header with live timer */}
      <ExamHeader
        student={student}
        timeLeftSeconds={timeLeft}
        totalAnswered={fullyAnsweredCount}
        totalQuestions={questions.length}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onToggleMobilePalette={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
        isMobilePaletteOpen={isMobilePaletteOpen}
      />

      {/* Main Grid: Question Content & Question Palette */}
      <main className="exam-layout">
        <QuestionView
          question={currentQ}
          questionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestionIndex]}
          isFlagged={Boolean(flags[currentQuestionIndex])}
          onSelectAnswer={handleSelectAnswer}
          onClearAnswer={handleClearAnswer}
          onToggleFlag={handleToggleFlag}
          onNext={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
          onPrev={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        />

        <QuestionPalette
          totalQuestions={questions.length}
          currentIndex={currentQuestionIndex}
          answers={answers}
          flags={flags}
          onSelectQuestion={(idx) => setCurrentQuestionIndex(idx)}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          isMobileOpen={isMobilePaletteOpen}
          onCloseMobile={() => setIsMobilePaletteOpen(false)}
        />
      </main>

      {/* Final Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        totalQuestions={questions.length}
        answeredCount={fullyAnsweredCount}
        flaggedCount={flaggedCount}
        timeLeftFormatted={timeLeftFormatted}
      />
    </div>
  );
}
