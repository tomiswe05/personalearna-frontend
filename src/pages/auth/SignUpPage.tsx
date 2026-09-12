import { useState, type FormEvent } from 'react';
import type { UserRole } from '../../types/user';
import styles from './SignUpPage.module.css';

type SignupRole = Exclude<UserRole, 'admin'>;

const ROLE_OPTIONS: Array<{ value: SignupRole; label: string; description: string }> = [
  { value: 'student', label: 'Student', description: 'I want to learn from my own material.' },
  { value: 'parent', label: 'Parent', description: "I want to create lessons for my child." },
  { value: 'teacher', label: 'Teacher', description: 'I want to assign material to my students.' },
];

export function SignUpPage() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<SignupRole | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSelectRole(value: SignupRole) {
    setRole(value);
    window.setTimeout(() => setStep('details'), 350);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    // TODO: wire up POST /users/signup once API integration begins
  }

  const selectedRoleLabel = ROLE_OPTIONS.find((option) => option.value === role)?.label;

  return (
    <div className={styles.page}>
      <p className={styles.brand}>PersonaLearn</p>
      <div className={styles.card}>
        {step === 'role' ? (
          <>
            <h1 className={styles.title}>How will you use PersonaLearn?</h1>
            <p className={styles.subtitle}>Pick the option that fits you best.</p>

            <div className={styles.roleGrid}>
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.roleCard} ${role === option.value ? styles.roleCardSelected : ''}`}
                  onClick={() => handleSelectRole(option.value)}
                >
                  <span className={styles.roleDot}>
                    <span className={styles.roleDotInner} />
                  </span>
                  <span>
                    <p className={styles.roleLabel}>{option.label}</p>
                    <p className={styles.roleDescription}>{option.description}</p>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>
              Upload your own material and get a lesson made just for you.
            </p>

            <button type="button" className={styles.roleBadge} onClick={() => setStep('role')}>
              {selectedRoleLabel} · change
            </button>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  Name
                </label>
                <input
                  id="name"
                  className={styles.input}
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="name@youremail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={styles.input}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={styles.input}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submit}>
                Sign Up
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
