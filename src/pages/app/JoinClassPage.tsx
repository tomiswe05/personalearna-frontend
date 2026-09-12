import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon, CheckIcon } from '../../components/icons';
import styles from './JoinClassPage.module.css';

// Simulates validating a class code against the backend — no
// Teacher<->Student relationship endpoint exists yet.
const MOCK_VALID_CODES: Record<string, { teacherName: string }> = {
  MRJONES1: { teacherName: 'Mr. Jones' },
  BIOCLASS: { teacherName: 'Ms. Adewale' },
};

export function JoinClassPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [joinedTeacher, setJoinedTeacher] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const match = MOCK_VALID_CODES[code.trim().toUpperCase()];
    if (!match) {
      setError("That code doesn't match a class. Double-check it and try again.");
      return;
    }

    setError(null);
    setJoinedTeacher(match.teacherName);
    // TODO: wire up POST /users/join-class (or similar) once that
    // Teacher<->Student relationship endpoint exists on the backend.
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate('/uploads')}>
          <ArrowLeftIcon size={14} />
          Back to Uploads
        </button>
      </div>

      <div className={styles.content}>
        {joinedTeacher ? (
          <div className={styles.successCard}>
            <span className={styles.successBadge}>
              <CheckIcon size={20} strokeWidth={3} />
            </span>
            <h1 className={styles.title}>You're in!</h1>
            <p className={styles.subtitle}>
              You're now linked to <strong>{joinedTeacher}</strong>'s class. Material they assign
              you will show up in your Uploads.
            </p>
            <button type="button" className={styles.submit} onClick={() => navigate('/uploads')}>
              Go to Uploads
            </button>
          </div>
        ) : (
          <>
            <h1 className={styles.title}>Join a class</h1>
            <p className={styles.subtitle}>
              Enter the code your teacher shared with you to see material they've assigned you.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="classCode" className={styles.label}>
                  Class code
                </label>
                <input
                  id="classCode"
                  className={styles.input}
                  placeholder="e.g. BIOCLASS"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value);
                    setError(null);
                  }}
                  autoCapitalize="characters"
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submit}>
                Join Class
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
