import { useLocation, useNavigate } from 'react-router';
import { ArrowLeftIcon, CheckIcon } from '../../components/icons';
import type { AssignedItemDetail } from '../../types/classes';
import styles from './StudentDetailPage.module.css';

type CompletionStatus = 'done' | 'inProgress' | 'notStarted';

// Placeholder — real data comes from GET /curriculum/teacher/students/:id
// once API integration begins. Deliberately has no learning
// style/pace/avatar fields — that stays private to the Student.
const MOCK_ASSIGNED_ITEMS: AssignedItemDetail[] = [
  {
    curriculumId: '1',
    title: 'World History: The Renaissance',
    courseTitle: 'The Renaissance — Visual Edition',
    overallProgress: 100,
    isCompleted: true,
    enrolledAt: '2026-08-20T10:00:00.000Z',
  },
  {
    curriculumId: '2',
    title: 'Intro to Chemistry',
    courseTitle: 'Intro to Chemistry — Reading Edition',
    overallProgress: 40,
    isCompleted: false,
    enrolledAt: '2026-08-25T10:00:00.000Z',
  },
  {
    curriculumId: '3',
    title: 'Basic Algebra Worksheet',
    overallProgress: 0,
    isCompleted: false,
  },
];

function getStatus(item: AssignedItemDetail): CompletionStatus {
  if (item.isCompleted) return 'done';
  if (item.overallProgress > 0) return 'inProgress';
  return 'notStarted';
}

const STATUS_LABEL: Record<CompletionStatus, string> = {
  done: 'Completed',
  inProgress: 'In progress',
  notStarted: 'Not started',
};

const STATUS_BADGE_CLASS: Record<CompletionStatus, string> = {
  done: 'statusDone',
  inProgress: 'statusInProgress',
  notStarted: 'statusNotStarted',
};

// Separate, higher-contrast set for the bare progress-bar mark (validated
// against our page surface, same values used on the Teacher Dashboard chart)
// — the softer badge colors above only pass contrast on their own tinted
// pill background, not as a bar sitting directly on the page surface.
const STATUS_FILL_CLASS: Record<CompletionStatus, string> = {
  done: 'fillDone',
  inProgress: 'fillInProgress',
  notStarted: 'fillNotStarted',
};

function formatDate(dateString?: string) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function StudentDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { studentName?: string } | null;
  const studentName = state?.studentName ?? 'This Student';

  const assignedItems = MOCK_ASSIGNED_ITEMS;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate('/teacher')}>
          <ArrowLeftIcon size={14} />
          Back to Dashboard
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{studentName}</h1>
        <p className={styles.subtitle}>
          {assignedItems.length} item{assignedItems.length === 1 ? '' : 's'} assigned
        </p>

        {assignedItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Nothing assigned yet</p>
            <p className={styles.emptySubtitle}>Upload material and assign it to {studentName} to see it here.</p>
            <button type="button" className={styles.emptyButton} onClick={() => navigate('/teacher/upload')}>
              Upload Material
            </button>
          </div>
        ) : (
          <div className={styles.tableScroll}>
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Material</span>
                <span>Status</span>
                <span>Progress</span>
                <span>Started</span>
              </div>

              {assignedItems.map((item) => {
                const status = getStatus(item);
                const enrolledLabel = formatDate(item.enrolledAt);

                return (
                  <div key={item.curriculumId} className={styles.row}>
                    <div className={styles.materialCell}>
                      <p className={styles.itemTitle}>{item.title}</p>
                      {item.courseTitle && item.courseTitle !== item.title && (
                        <p className={styles.itemSubtitle}>{item.courseTitle}</p>
                      )}
                    </div>

                    <span className={`${styles.statusBadge} ${styles[STATUS_BADGE_CLASS[status]]}`}>
                      {status === 'done' && <CheckIcon size={11} strokeWidth={3} />}
                      {STATUS_LABEL[status]}
                    </span>

                    <div className={styles.progressCell}>
                      <div className={styles.progressTrack}>
                        <div
                          className={`${styles.progressFill} ${styles[STATUS_FILL_CLASS[status]]}`}
                          style={{ width: `${item.overallProgress}%` }}
                        />
                      </div>
                      <span className={styles.progressPercent}>{item.overallProgress}%</span>
                    </div>

                    <span className={styles.startedCell}>{enrolledLabel ?? '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
