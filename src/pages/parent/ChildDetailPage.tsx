import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeftIcon, CheckIcon } from '../../components/icons';
import type { AssignedItemDetail } from '../../types/classes';
import styles from './ChildDetailPage.module.css';

type CompletionStatus = 'done' | 'inProgress' | 'notStarted';

// Placeholder — real data comes from a "this child's assigned material"
// endpoint once one exists. Deliberately has no learning style/pace/avatar
// fields, same as the Teacher's Student Detail view.
const MOCK_ASSIGNED_ITEMS: AssignedItemDetail[] = [
  {
    curriculumId: '1',
    title: 'Fun with Fractions',
    courseTitle: 'Fun with Fractions — Visual Edition',
    overallProgress: 100,
    isCompleted: true,
    enrolledAt: '2026-08-18T10:00:00.000Z',
  },
  {
    curriculumId: '2',
    title: 'The Solar System',
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

const STATUS_FILL_CLASS: Record<CompletionStatus, string> = {
  done: 'fillDone',
  inProgress: 'fillInProgress',
  notStarted: 'fillNotStarted',
};

export function ChildDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { childName?: string } | null;
  const childName = state?.childName ?? 'Your Child';

  const assignedItems = MOCK_ASSIGNED_ITEMS;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate('/parent')}>
          <ArrowLeftIcon size={14} />
          Back to Your Children
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{childName}</h1>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => navigate(`/parent/children/${id}/upload`, { state: { childName } })}
          >
            Upload Material
          </button>
        </div>

        {assignedItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Nothing uploaded yet</p>
            <p className={styles.emptySubtitle}>
              Upload material for {childName} to see it show up here.
            </p>
            <button
              type="button"
              className={styles.emptyButton}
              onClick={() => navigate(`/parent/children/${id}/upload`, { state: { childName } })}
            >
              Upload Material
            </button>
          </div>
        ) : (
          <div className={styles.itemList}>
            {assignedItems.map((item) => {
              const status = getStatus(item);

              return (
                <div key={item.curriculumId} className={styles.itemCard}>
                  <div className={styles.itemHead}>
                    <div className={styles.itemHeadText}>
                      <p className={styles.itemTitle}>{item.title}</p>
                      {item.courseTitle && item.courseTitle !== item.title && (
                        <p className={styles.itemSubtitle}>{item.courseTitle}</p>
                      )}
                    </div>
                    <span className={`${styles.statusBadge} ${styles[STATUS_BADGE_CLASS[status]]}`}>
                      {status === 'done' && <CheckIcon size={11} strokeWidth={3} />}
                      {STATUS_LABEL[status]}
                    </span>
                  </div>

                  <div className={styles.progressTrack}>
                    <div
                      className={`${styles.progressFill} ${styles[STATUS_FILL_CLASS[status]]}`}
                      style={{ width: `${item.overallProgress}%` }}
                    />
                  </div>
                  <p className={styles.itemMeta}>{item.overallProgress}% complete</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
