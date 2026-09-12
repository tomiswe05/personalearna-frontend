import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeftIcon, UploadCloudIcon, XIcon, CheckIcon } from '../../components/icons';
import styles from './UploadPdfPage.module.css';

type Status = 'idle' | 'uploading' | 'done';
type Phase = 'details' | 'assign';
type Variant = 'student' | 'teacher' | 'parent';

const MAX_FILE_SIZE = 25 * 1_000_000; // matches the backend's Multer limit

// Only used for the teacher variant — placeholder for the Teacher's linked
// students, same roster as the Dashboard. Real data comes from
// GET /curriculum/teacher/students once API integration begins.
const MOCK_LINKED_STUDENTS = [
  { studentId: '1', name: 'Ava Thompson' },
  { studentId: '2', name: 'Liam Carter' },
  { studentId: '3', name: 'Noah Bennett' },
];

interface UploadPdfPageProps {
  // 'teacher' adds the "Assign to" step after Title/Description (a Teacher
  // has many linked students to pick from). 'parent' skips that step
  // entirely — a Parent's upload is always implicitly for the one child
  // whose route this was reached from. Everything else — the dropzone,
  // file validation, simulated progress — is identical across all three.
  variant?: Variant;
}

export function UploadPdfPage({ variant = 'student' }: UploadPdfPageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id: childId } = useParams<{ id: string }>();
  const location = useLocation();
  const childName = (location.state as { childName?: string } | null)?.childName ?? 'your child';

  const backTarget =
    variant === 'teacher' ? '/teacher' : variant === 'parent' ? `/parent/children/${childId}` : '/uploads';

  const [status, setStatus] = useState<Status>('idle');
  const [phase, setPhase] = useState<Phase>('details');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(
    () => new Set(MOCK_LINKED_STUDENTS.map((student) => student.studentId)),
  );

  // Simulated upload progress — once wired to the real API, this becomes
  // an axios onUploadProgress callback instead of a fake interval.
  useEffect(() => {
    if (status !== 'uploading') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + Math.random() * 18 + 6);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setStatus('done'), 400);
          return 100;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [status]);

  function handleFile(selected: File) {
    if (selected.type !== 'application/pdf') {
      setFileError('Only PDF files are supported.');
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFileError('File is too large — max 25MB.');
      return;
    }

    setFileError(null);
    setFile(selected);
    setProgress(0);
    setStatus('uploading');
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) handleFile(selected);
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  }

  function handleCancelUpload() {
    setStatus('idle');
    setFile(null);
    setProgress(0);
  }

  function handleChangeFile() {
    setStatus('idle');
    setPhase('details');
    setFile(null);
    setProgress(0);
    setTitle('');
    setDescription('');
  }

  function toggleStudent(studentId: string) {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  function handleDetailsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (variant === 'teacher') {
      setPhase('assign');
      return;
    }
    // TODO: wire up POST /curriculum/create (title, description, file,
    // and — for the parent variant — an implicit assignedTo: [childId])
    // once API integration begins
    navigate(backTarget);
  }

  function handleAssignSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire up POST /curriculum/create (title, description, file,
    // assignedTo: [...selectedStudentIds]) once API integration begins
    navigate('/teacher');
  }

  const secondsLeft = Math.max(1, Math.round((100 - progress) / 12));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate(backTarget)}>
          <ArrowLeftIcon size={14} />
          Back
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{variant === 'student' ? 'Upload a PDF' : 'Upload Material'}</h1>
        <p className={styles.subtitle}>
          {variant === 'teacher' && 'Upload material and assign it to your students.'}
          {variant === 'parent' && `Upload material for ${childName}.`}
          {variant === 'student' && "Upload your own material and we'll turn it into a personalized lesson."}
        </p>

        {status === 'idle' && (
          <>
            <div
              className={dragActive ? `${styles.dropzone} ${styles.dropzoneActive}` : styles.dropzone}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <span className={styles.dropzoneIcon}>
                <UploadCloudIcon />
              </span>
              <p className={styles.dropzoneTitle}>Browse a PDF file</p>
              <p className={styles.dropzoneHint}>PDF format only, max 25MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className={styles.fileInput}
              onChange={handleInputChange}
            />
            {fileError && <p className={styles.fileError}>{fileError}</p>}
          </>
        )}

        {status === 'uploading' && file && (
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <p className={styles.fileName}>Uploading {file.name}...</p>
              <button
                type="button"
                className={styles.cancelButton}
                aria-label="Cancel upload"
                onClick={handleCancelUpload}
              >
                <XIcon />
              </button>
            </div>
            <p className={styles.progressMeta}>
              {Math.round(progress)}% · {secondsLeft}s left
            </p>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {status === 'done' && file && (
          <>
            <div className={styles.successCard}>
              <span className={styles.successIcon}>
                <CheckIcon />
              </span>
              <div className={styles.successInfo}>
                <p className={styles.successLabel}>Uploaded</p>
                <p className={styles.fileName}>{file.name}</p>
              </div>
              <button type="button" className={styles.cancelButton} aria-label="Remove file" onClick={handleChangeFile}>
                <XIcon />
              </button>
            </div>

            {phase === 'details' && (
              <form className={styles.form} onSubmit={handleDetailsSubmit}>
                <div className={styles.field}>
                  <label htmlFor="title" className={styles.label}>
                    Title
                  </label>
                  <input
                    id="title"
                    className={styles.input}
                    placeholder="Intro to Biology"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="description" className={styles.label}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    className={styles.textarea}
                    placeholder="A short summary of what this curriculum covers."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.submit}>
                  {variant === 'teacher' ? 'Continue' : 'Create Curriculum'}
                </button>
              </form>
            )}

            {phase === 'assign' && (
              <form className={styles.form} onSubmit={handleAssignSubmit}>
                <div className={styles.field}>
                  <span className={styles.label}>Assign to</span>
                  <div className={styles.studentList}>
                    {MOCK_LINKED_STUDENTS.map((student) => (
                      <label key={student.studentId} className={styles.studentRow}>
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.has(student.studentId)}
                          onChange={() => toggleStudent(student.studentId)}
                        />
                        {student.name}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className={styles.submit} disabled={selectedStudentIds.size === 0}>
                  Assign & Create Curriculum
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
