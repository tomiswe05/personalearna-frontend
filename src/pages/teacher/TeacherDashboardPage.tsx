import { useNavigate } from 'react-router';
import { UsersIcon, FileIcon } from '../../components/icons';
import type { TeacherStudentSummary } from '../../types/classes';
import styles from './TeacherDashboardPage.module.css';

// Placeholder roster — real data comes from GET /curriculum/teacher/students
// once API integration begins. Set this to [] to preview the empty state.
const MOCK_ROSTER: TeacherStudentSummary[] = [
  { studentId: '1', name: 'Ava Thompson', totalAssigned: 4, completedCount: 4 },
  { studentId: '2', name: 'Liam Carter', totalAssigned: 5, completedCount: 2 },
  { studentId: '3', name: 'Noah Bennett', totalAssigned: 3, completedCount: 0 },
];

type CompletionStatus = 'done' | 'inProgress' | 'notStarted';

// Bar-fill/legend colors are deliberately darker than the badge colors below —
// validated with the dataviz skill's contrast checker against our #FFFFFC
// surface (mark contrast needs >= 3:1; #FF7F11/#A39C8A only clear ~2.5-2.7:1
// there, so they're fine as small badge text on a tinted background, but not
// as a bare mark on the page surface).
const STATUS_MARK_COLOR: Record<CompletionStatus, string> = {
  done: '#1f9d68',
  inProgress: '#d9670a',
  notStarted: '#6b6459',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getStatus(student: TeacherStudentSummary): CompletionStatus {
  if (student.totalAssigned > 0 && student.completedCount === student.totalAssigned) return 'done';
  if (student.completedCount > 0) return 'inProgress';
  return 'notStarted';
}

const STATUS_LABEL: Record<CompletionStatus, string> = {
  done: 'All caught up',
  inProgress: 'In progress',
  notStarted: 'Not started',
};

const STATUS_CLASS: Record<CompletionStatus, string> = {
  done: styles.statusDone,
  inProgress: styles.statusInProgress,
  notStarted: styles.statusNotStarted,
};

function StudentCard({ student, onClick }: { student: TeacherStudentSummary; onClick: () => void }) {
  const status = getStatus(student);

  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.cardHead}>
        <span className={styles.avatar}>{getInitials(student.name)}</span>
        <span className={styles.name}>{student.name}</span>
      </div>

      <span className={`${styles.statusBadge} ${STATUS_CLASS[status]}`}>
        <span className={styles.statusDot} />
        {STATUS_LABEL[status]}
      </span>

      <p className={styles.cardFraction}>
        {student.completedCount} of {student.totalAssigned} assigned completed
      </p>
    </button>
  );
}

// The comparison chart — one bar per student, length = % of assigned material
// completed, colored by status. Values are always shown as direct labels
// (never gated behind hover), per the dataviz skill's tooltip guidance.
function CompletionChart({ roster }: { roster: TeacherStudentSummary[] }) {
  return (
    <div className={styles.chartBlock}>
      <div className={styles.chartHeadRow}>
        <h2 className={styles.chartTitle}>Completion by Student</h2>
        <div className={styles.legend}>
          {(Object.keys(STATUS_LABEL) as CompletionStatus[]).map((status) => (
            <span key={status} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: STATUS_MARK_COLOR[status] }} />
              {STATUS_LABEL[status]}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.barChart}>
        {roster.map((student) => {
          const percent = student.totalAssigned > 0
            ? Math.round((student.completedCount / student.totalAssigned) * 100)
            : 0;
          const status = getStatus(student);

          return (
            <div key={student.studentId} className={styles.barRow}>
              <span className={styles.barLabel}>{student.name}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${percent}%`, background: STATUS_MARK_COLOR[status] }}
                  title={`${student.name}: ${percent}% (${student.completedCount} of ${student.totalAssigned})`}
                />
              </div>
              <span className={styles.barValue}>{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TeacherDashboardPage() {
  const navigate = useNavigate();
  const roster = MOCK_ROSTER;

  const totalAssignedSum = roster.reduce((sum, student) => sum + student.totalAssigned, 0);
  const totalCompletedSum = roster.reduce((sum, student) => sum + student.completedCount, 0);
  const classCompletion = totalAssignedSum > 0 ? Math.round((totalCompletedSum / totalAssignedSum) * 100) : 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Your Class</h1>

          <div className={styles.actionsRight}>
            <button type="button" className={styles.inviteLink} onClick={() => navigate('/teacher/invite')}>
              Invite Students
            </button>
            <button type="button" className={styles.uploadButton} onClick={() => navigate('/teacher/upload')}>
              Upload Material
            </button>
          </div>
        </div>

        {roster.length > 0 && (
          <>
            <div className={styles.statRow}>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>
                  <UsersIcon size={18} />
                </span>
                <p className={styles.statLabel}>Students</p>
                <p className={styles.statValue}>{roster.length}</p>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>
                  <FileIcon size={18} />
                </span>
                <p className={styles.statLabel}>Assignments Given</p>
                <p className={styles.statValue}>{totalAssignedSum}</p>
              </div>
            </div>

            <div className={styles.meterBlock}>
              <div className={styles.meterHeadRow}>
                <p className={styles.meterLabel}>Class Completion</p>
                <p className={styles.meterValue}>{classCompletion}%</p>
              </div>
              <div className={styles.meterTrack}>
                <div className={styles.meterFill} style={{ width: `${classCompletion}%` }} />
              </div>
            </div>

            <CompletionChart roster={roster} />
          </>
        )}

        {roster.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <UsersIcon size={24} />
            </span>
            <h2 className={styles.emptyTitle}>No students yet</h2>
            <p className={styles.emptySubtitle}>
              Share your class code so students can join, then assign them material.
            </p>
            <button type="button" className={styles.emptyButton} onClick={() => navigate('/teacher/invite')}>
              Invite Students
            </button>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {roster.map((student) => (
              <StudentCard
                key={student.studentId}
                student={student}
                onClick={() =>
                  navigate(`/teacher/students/${student.studentId}`, { state: { studentName: student.name } })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
