import { useLocation, useNavigate, useParams } from 'react-router';
import type { Curriculum } from '../../types/curriculum';
import { ArrowLeftIcon, FileIcon } from '../../components/icons';
import { PersonalizedOverview, type PersonalizedOverviewData } from './PersonalizedOverview';
import styles from './CurriculumDetailPage.module.css';

// Placeholder content for the "already personalized" state — there's no
// GET endpoint yet that returns a real UserCurriculum's overview, so this
// stands in for it. Which state actually renders is now driven by the
// `hasLesson` flag passed from UploadsPage's status badge, not this data
// existing or not.
const MOCK_PERSONALIZATION_DATA: PersonalizedOverviewData = {
  courseTitle: 'Intro to Biology — Visual Edition',
  summary:
    'A foundational walkthrough of cell structure, genetics, and ecosystems, rewritten to fit a visual, moderate-paced learning style.',
  learningObjectives: [
    'Identify the main structures of a cell and explain their functions',
    'Describe how traits are passed from parents to offspring',
    'Explain how energy flows through an ecosystem',
  ],
  keyTakeaways: [
    'Cells are the basic unit of life, and their structure determines their function.',
    'Genetic information is encoded in DNA and passed down through generations.',
    'Ecosystems rely on interconnected energy and nutrient cycles.',
  ],
  sourceType: 'Textbook Chapter',
  estimatedTotalDuration: '15 minutes',
  totalModules: 1,
  overallProgress: 35,
  modules: [
    {
      moduleNumber: 1,
      moduleTitle: 'Cells, Genetics & Ecosystems',
      lessons: [
        { lessonNumber: 1, lessonTitle: 'What Makes Up a Cell', duration: '4 min', isCompleted: true },
        { lessonNumber: 2, lessonTitle: 'How Traits Get Passed Down', duration: '5 min', isCompleted: false },
        { lessonNumber: 3, lessonTitle: 'Energy Flow in Ecosystems', duration: '6 min', isCompleted: false },
      ],
    },
  ],
};

function formatDate(dateString?: string) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CurriculumDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // No GET /curriculum/:id endpoint exists yet — the Uploads page hands us
  // the curriculum it already fetched via navigation state. A hard refresh
  // loses that, so we fall back to sending the user back to the list.
  const state = location.state as { curriculum?: Curriculum; hasLesson?: boolean } | null;
  const curriculum = state?.curriculum;
  const hasLesson = state?.hasLesson ?? false;

  if (!curriculum) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.brand}>PersonaLearn</span>
        </header>
        <div className={styles.fallback}>
          <p className={styles.fallbackText}>
            We couldn't find that upload — it may have been opened directly instead of from your uploads list.
          </p>
          <button type="button" className={styles.backLink} onClick={() => navigate('/uploads')}>
            <ArrowLeftIcon size={14} />
            Back to Uploads
          </button>
        </div>
      </div>
    );
  }

  function handleViewPdf() {
    // TODO: wire up GET /curriculum/:id/pdf once API integration begins —
    // open the returned signed url in a new tab
  }

  function handlePersonalize() {
    navigate(`/curriculum/${id}/personalize`);
  }

  function handleContinueLearning() {
    navigate(`/curriculum/${id}/lesson`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate('/uploads')}>
          <ArrowLeftIcon size={14} />
          Back
        </button>
      </div>

      <div className={styles.content}>
        {hasLesson ? (
          <PersonalizedOverview overview={MOCK_PERSONALIZATION_DATA} onContinue={handleContinueLearning} />
        ) : (
          <>
            <h1 className={styles.title}>{curriculum.title}</h1>
            <p className={styles.meta}>Uploaded {formatDate(curriculum.createdAt)}</p>
            <p className={styles.description}>{curriculum.description}</p>

            <button type="button" className={styles.viewPdfButton} onClick={handleViewPdf}>
              <FileIcon size={14} />
              View PDF
            </button>

            <div className={styles.callout}>
              <div className={styles.calloutText}>
                <p className={styles.calloutTitle}>Ready to make this yours?</p>
                <p className={styles.calloutSubtitle}>
                  Turn this into a personalized lesson made just for you.
                </p>
              </div>
              <button type="button" className={styles.personalizeButton} onClick={handlePersonalize}>
                Personalize
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
