import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeftIcon } from '../../components/icons';
import styles from './LessonPage.module.css';

// Mirrors one MicroLesson from UserCurriculum.modules[].lessons[] — only
// the fields the text-reading state actually needs. videoUrl/videoStatus
// etc. belong to the video state, built separately.
interface MockMicroLesson {
  moduleTitle: string;
  moduleNumber: number;
  lessonNumber: number;
  lessonTitle: string;
  duration: string;
  script: string;
  quizCount: number;
}

// Placeholder — real data comes from a UserCurriculum once API integration
// begins. Only 1 module/1 lesson ever exists right now (free-tier cap on
// AI Agent 2), so there's nothing to page between yet.
const MOCK_LESSON: MockMicroLesson = {
  moduleTitle: 'Cell Structure & Function',
  moduleNumber: 1,
  lessonNumber: 1,
  lessonTitle: 'What Is a Cell?',
  duration: '2-3 minutes',
  script: `Every living thing you've ever seen — a tree, a bird, even you — is built from the same basic unit: the cell.

Think of a cell like a tiny factory. It has a control room, called the nucleus, which holds the instructions for everything the cell does. Surrounding it is the cytoplasm, a gel-like substance where most of the cell's work actually happens.

Just like a factory needs walls, a cell has a membrane — a thin barrier that decides what gets in and what stays out. This is how cells protect themselves while still exchanging nutrients and waste with the world around them.

Some cells have an extra layer of protection, especially in plants, called a cell wall. This gives plant cells a rigid structure, which is why a stalk of celery snaps instead of squishing.

Every function of a living organism, from growing to healing to breathing, ultimately comes down to what's happening inside cells like these.`,
  quizCount: 1,
};

export function LessonPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleTakeQuiz() {
    navigate(`/curriculum/${id}/quiz`);
  }

  const paragraphs = MOCK_LESSON.script.split('\n\n');

  return (
    <div className={styles.page}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${readProgress}%` }} />
      </div>

      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate(`/curriculum/${id}`)}>
          <ArrowLeftIcon size={14} />
          Back
        </button>
      </div>

      <div className={styles.content}>
        <p className={styles.moduleLabel}>Module {MOCK_LESSON.moduleNumber} · {MOCK_LESSON.moduleTitle}</p>
        <h1 className={styles.title}>{MOCK_LESSON.lessonTitle}</h1>
        <p className={styles.duration}>{MOCK_LESSON.duration}</p>

        <div className={styles.script}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className={styles.quizBar}>
        <div className={styles.quizBarInner}>
          <div className={styles.quizPromptText}>
            <p className={styles.quizPromptTitle}>Ready to check your understanding?</p>
            <p className={styles.quizPromptSubtitle}>
              {MOCK_LESSON.quizCount} quick question{MOCK_LESSON.quizCount === 1 ? '' : 's'} based on this lesson.
            </p>
          </div>
          <button type="button" className={styles.quizButton} onClick={handleTakeQuiz}>
            Take the Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
