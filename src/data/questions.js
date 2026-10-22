// بنك أسئلة امتحان الرياضيات (22 سؤالاً مصوراً)
// السؤال رقم 20 يحتوي على 5 فقرات داخلية
// السؤال رقم 22 يحتوي على فقرتين داخليتين
// ✅ تم تحديث جميع الإجابات الصحيحة النهائية

export const EXAM_CONFIG = {
  title: "امتحان الرياضيات (تفاضل وتكامل)",
  subject: "الصف الثالث الثانوي - النماذج الاسترشادية",
  totalQuestions: 22,
  durationMinutes: 60,
  passingScorePercent: 50,
  maxAttempts: 1,
  adminBypassKey: "reset2026"
};

const DEFAULT_OPTIONS = [
  { id: "أ", label: "( أ )" },
  { id: "ب", label: "( ب )" },
  { id: "ج", label: "( ج )" },
  { id: "د", label: "( د )" }
];
const getImagePath = (filename) =>
  `${import.meta.env.BASE_URL}questions/${filename}`;
export const INITIAL_QUESTIONS = [
  {
    id: 1,
    topic: "تفاضل وتكامل",
    image: getImagePath("1.jpg"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ب"
  },
  {
    id: 2,
    topic: "تفاضل وتكامل",
    image: getImagePath("2.jpg"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ب"
  },
  {
    id: 3,
    topic: "تفاضل وتكامل",
    image: getImagePath("3.jpg"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ب"
  },
  {
    id: 4,
    topic: "تفاضل وتكامل",
    image: getImagePath("4.jpg"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ج"
  },
  {
    id: 5,
    topic: "تفاضل وتكامل",
    image: getImagePath("5.jpg"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "أ"
  },
  {
    id: 6,
    topic: "تفاضل وتكامل",
    image: getImagePath("6.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ب"
  },
  {
    id: 7,
    topic: "تفاضل وتكامل",
    image: getImagePath("7.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ب"
  },
  {
    id: 8,
    topic: "تفاضل وتكامل",
    image: getImagePath("8.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "د"
  },
  {
    id: 9,
    topic: "تفاضل وتكامل",
    image: getImagePath("9.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ج"
  },
  {
    id: 10,
    topic: "تفاضل وتكامل",
    image: getImagePath("10.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ج"
  },
  {
    id: 11,
    topic: "تفاضل وتكامل",
    image: getImagePath("11.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ب"
  },
  {
    id: 12,
    topic: "تفاضل وتكامل",
    image: getImagePath("12.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "د"
  },
  {
    id: 13,
    topic: "تفاضل وتكامل",
    image: getImagePath("13.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ج"
  },
  {
    id: 14,
    topic: "تفاضل وتكامل",
    image: getImagePath("14.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ب"
  },
  {
    id: 15,
    topic: "تفاضل وتكامل",
    image: getImagePath("15.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ج"
  },
  {
    id: 16,
    topic: "تفاضل وتكامل",
    image: getImagePath("16.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ج"
  },
  {
    id: 17,
    topic: "تفاضل وتكامل",
    image: getImagePath("17.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "أ"
  },
  {
    id: 18,
    topic: "تفاضل وتكامل",
    image: getImagePath("18.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "أ"
  },
  {
    id: 19,
    topic: "تفاضل وتكامل",
    image: getImagePath("19.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "د"
  },
  {
    id: 20,
    topic: "تفاضل وتكامل (سلوك الدالة ورسم المنحنيات)",
    image: getImagePath("20.png"),
    hasSubQuestions: true,
    subQuestions: [
      {
        subId: 1,
        title: "الفقرة (١): د(س) لها قيمة عظمى محلية عند س = ...",
        options: DEFAULT_OPTIONS,
        correctAnswer: "ب"
      },
      {
        subId: 2,
        title: "الفقرة (٢): د(س) لها قيمة صغرى محلية عند س = ...",
        options: DEFAULT_OPTIONS,
        correctAnswer: "د"
      },
      {
        subId: 3,
        title: "الفقرة (٣): د(س) لها نقطة انقلاب عند س = ...",
        options: DEFAULT_OPTIONS,
        correctAnswer: "ج"
      },
      {
        subId: 4,
        title: "الفقرة (٤): منحنى د(س) محدب لأعلى عندما س ∈ ...",
        options: DEFAULT_OPTIONS,
        correctAnswer: "أ"
      },
      {
        subId: 5,
        title: "الفقرة (٥): د(س) متناقصة عندما س ∈ ...",
        options: DEFAULT_OPTIONS,
        correctAnswer: "ج"
      }
    ]
  },
  {
    id: 21,
    topic: "تفاضل وتكامل",
    image: getImagePath("21.png"),
    options: DEFAULT_OPTIONS,
    correctAnswer: "ب"
  },
  {
    id: 22,
    topic: "تفاضل وتكامل (سلوك الدالة ورسم المنحنيات)",
    image: getImagePath("22.png"),
    hasSubQuestions: true,
    subQuestions: [
      {
        subId: 1,
        title: "الفقرة (١): منحنى د(س) له قيمة عظمى عند س = ...",
        options: DEFAULT_OPTIONS,
        correctAnswer: "د"
      },
      {
        subId: 2,
        title: "الفقرة (٢): منحنى د(س) له قيمة صغرى عند س = ...",
        options: DEFAULT_OPTIONS,
        correctAnswer: "أ"
      }
    ]
  }
];
