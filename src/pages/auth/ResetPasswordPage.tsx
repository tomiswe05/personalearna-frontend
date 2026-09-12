import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import styles from './ResetPasswordPage.module.css';

// Matches the backend's rule: 8+ characters, at least one digit.
const PASSWORD_RULE = /^(?=.*\d).{8,}$/;

export function ResetPasswordPage() {
  // The reset token isn't typed by the user — it arrives in the URL from
  // the link in the reset email, e.g. /reset-password?token=abc123.
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Checks there's a token, the password meets the strength rule, and the
  // two password fields match — then (once wired up) sends the reset request.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setError('This reset link is invalid or missing. Please request a new one.');
      return;
    }

    if (!PASSWORD_RULE.test(password)) {
      setError('Password must be at least 8 characters and contain at least one number.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    // TODO: wire up POST /auth/reset-password with { token, password } once
    // API integration begins
  }

  return (
    <div className={styles.page}>
      <p className={styles.brand}>PersonaLearn</p>
      <div className={styles.card}>
        <h1 className={styles.title}>Set a new password</h1>
        <p className={styles.subtitle}>Choose a new password for your account.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              New password
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
            <span className={styles.hint}>Must be 8+ characters and include a number.</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
