import { useNavigate } from 'react-router';
import { PlusIcon, UsersIcon } from '../../components/icons';
import type { ChildProfile } from '../../types/classes';
import styles from './ParentDashboardPage.module.css';

// Placeholder — real data comes from a "my children" endpoint once that
// exists on the backend. Set this to [] to preview the empty state.
const MOCK_CHILDREN: ChildProfile[] = [
  { childId: '1', name: 'Maya', avatarColor: '#ff3f00' },
  { childId: '2', name: 'Theo', avatarColor: '#1f9d68' },
];

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

export function ParentDashboardPage() {
  const navigate = useNavigate();
  const children = MOCK_CHILDREN;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Your Children</h1>
          <button type="button" className={styles.addButton} onClick={() => navigate('/parent/children/new')}>
            Add Child
            <PlusIcon size={14} />
          </button>
        </div>

        {children.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <UsersIcon size={24} />
            </span>
            <h2 className={styles.emptyTitle}>No children added yet</h2>
            <p className={styles.emptySubtitle}>
              Add your child's profile to start uploading and personalizing lessons for them.
            </p>
            <button type="button" className={styles.emptyButton} onClick={() => navigate('/parent/children/new')}>
              Add Child
            </button>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {children.map((child) => (
              <button
                key={child.childId}
                type="button"
                className={styles.card}
                onClick={() =>
                  navigate(`/parent/children/${child.childId}`, { state: { childName: child.name } })
                }
              >
                <span className={styles.avatar} style={{ background: child.avatarColor }}>
                  {getInitial(child.name)}
                </span>
                <span className={styles.name}>{child.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
