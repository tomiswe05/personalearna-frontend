import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Curriculum } from '../../types/curriculum';
import { PlusIcon, TableIcon, CardIcon, SearchIcon, TrashIcon } from '../../components/icons';
import styles from './UploadsPage.module.css';

type ViewMode = 'table' | 'card';

// Placeholder rows so the list state is visible before API integration.
// Set this to [] to preview the empty state instead.
const MOCK_UPLOADS: Curriculum[] = [
  {
    _id: '1',
    title: 'Intro to Biology',
    description: 'Foundational biology curriculum covering cells, genetics, and ecosystems.',
    createdBy: 'me',
    isPublished: true,
    createdAt: '2026-08-12T10:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Financial Literacy 101',
    description: 'A practical guide to budgeting, saving, and understanding credit.',
    createdBy: 'me',
    isPublished: true,
    createdAt: '2026-08-20T10:00:00.000Z',
  },
  {
    _id: '3',
    title: 'World History: The Renaissance',
    description: 'Assigned reading covering the causes and legacy of the Renaissance.',
    createdBy: 'teacher',
    isPublished: true,
    createdAt: '2026-08-28T10:00:00.000Z',
    assignedByTeacherName: 'Ms. Adewale',
  },
];

// Simulates a per-curriculum "does a UserCurriculum already exist" flag —
// the real backend has no endpoint for this yet (see memory: known gaps).
// Keyed by curriculum _id.
const MOCK_LESSON_STATUS: Record<string, boolean> = {
  '1': true,
  '2': false,
};

function StatusBadge({ hasLesson }: { hasLesson: boolean }) {
  return (
    <span className={hasLesson ? styles.statusDone : styles.statusPending}>
      <span className={styles.statusDot} />
      {hasLesson ? 'Personalized' : 'Not started'}
    </span>
  );
}

function DateOrAssignedTag({ upload, dateClassName }: { upload: Curriculum; dateClassName: string }) {
  if (upload.assignedByTeacherName) {
    return <span className={styles.assignedTag}>Assigned by {upload.assignedByTeacherName}</span>;
  }
  return <span className={dateClassName}>{formatDate(upload.createdAt)}</span>;
}

function formatDate(dateString?: string) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function UploadsPage() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState<Curriculum[]>(MOCK_UPLOADS);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUploads = uploads.filter((upload) =>
    upload.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  // The card/table toggle is a mobile & tablet thing only — force back to
  // table view if the window is resized up to desktop width, so a choice
  // made on a small screen doesn't linger once there's room for the table.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1025px)');

    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) setViewMode('table');
    }

    desktop.addEventListener('change', handleChange);
    return () => desktop.removeEventListener('change', handleChange);
  }, []);

  // Removed locally for now — once wired up, this becomes a real
  // DELETE /curriculum/:id call (that endpoint doesn't exist on the
  // backend yet, so it'll need to be added when this gets integrated).
  function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation();
    setUploads((prev) => prev.filter((upload) => upload._id !== id));
  }

  function goToDetail(upload: Curriculum) {
    // No GET /curriculum/:id endpoint exists yet, so hand the data we
    // already have straight to the detail page via navigation state —
    // including whether a lesson already exists, so it knows which state
    // to render (also simulated, same missing-endpoint reason).
    navigate(`/curriculum/${upload._id}`, {
      state: { curriculum: upload, hasLesson: MOCK_LESSON_STATUS[upload._id] ?? false },
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Uploads</h1>

          {uploads.length > 0 && (
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search uploads..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          )}
        </div>

        <div className={styles.actionsRow}>
          {uploads.length > 0 && (
            <div className={styles.viewToggle}>
              <button
                type="button"
                className={viewMode === 'table' ? styles.viewButtonActive : styles.viewButton}
                onClick={() => setViewMode('table')}
                aria-label="Table view"
                aria-pressed={viewMode === 'table'}
              >
                <TableIcon />
              </button>
              <span className={styles.viewDivider} />
              <button
                type="button"
                className={viewMode === 'card' ? styles.viewButtonActive : styles.viewButton}
                onClick={() => setViewMode('card')}
                aria-label="Card view"
                aria-pressed={viewMode === 'card'}
              >
                <CardIcon />
              </button>
            </div>
          )}

          <div className={styles.actionsRight}>
            <button type="button" className={styles.joinClassLink} onClick={() => navigate('/join-class')}>
              Join a Class
            </button>

            <button type="button" className={styles.uploadLink} onClick={() => navigate('/upload')}>
              Upload PDF
              <PlusIcon />
            </button>
          </div>
        </div>

        {uploads.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </span>
            <h2 className={styles.emptyTitle}>No uploads yet</h2>
            <p className={styles.emptySubtitle}>
              Upload a PDF to turn it into a personalized lesson.
            </p>
            <button type="button" className={styles.uploadButton}>
              Upload PDF
            </button>
          </div>
        ) : (
          <>
            {filteredUploads.length === 0 ? (
              <p className={styles.noResults}>No uploads match "{searchQuery}".</p>
            ) : viewMode === 'table' ? (
              <div className={styles.tableScroll}>
                <div className={styles.table}>
                  <div className={styles.tableHead}>
                    <span>Document</span>
                    <span>Date Uploaded</span>
                    <span />
                  </div>

                  {filteredUploads.map((upload) => (
                    <div
                      key={upload._id}
                      className={styles.row}
                      onClick={() => goToDetail(upload)}
                    >
                      <div>
                        <div className={styles.docTitleRow}>
                          <p className={styles.docTitle}>{upload.title}</p>
                          <StatusBadge hasLesson={MOCK_LESSON_STATUS[upload._id] ?? false} />
                        </div>
                        <p className={styles.docDescription}>{upload.description}</p>
                      </div>
                      <DateOrAssignedTag upload={upload} dateClassName={styles.date} />
                      <button
                        type="button"
                        className={styles.deleteButton}
                        aria-label={`Delete ${upload.title}`}
                        onClick={(event) => handleDelete(upload._id, event)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                {filteredUploads.map((upload) => (
                  <div
                    key={upload._id}
                    className={styles.card}
                    onClick={() => goToDetail(upload)}
                  >
                    <div className={styles.cardHead}>
                      <p className={styles.docTitle}>{upload.title}</p>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        aria-label={`Delete ${upload.title}`}
                        onClick={(event) => handleDelete(upload._id, event)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <StatusBadge hasLesson={MOCK_LESSON_STATUS[upload._id] ?? false} />
                    <p className={styles.cardDescription}>{upload.description}</p>
                    <DateOrAssignedTag upload={upload} dateClassName={styles.cardDate} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
