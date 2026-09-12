import { useState, type FormEvent } from 'react';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    // TODO: wire up POST /users/login once API integration begins
    // (handle the "email not verified" case separately — redirect to
    // Verify Email instead of showing this as a generic error)
  }

  // Reuses whatever email is already typed into the form above — no
  // separate "enter your email" screen. Shows the same generic message
  // the backend returns either way, so it never reveals if the account exists.
  function handleForgotPassword() {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password?"');
      return;
    }

    setError(null);
    setForgotPasswordMessage(
      `If an account exists for ${email}, we've sent a password reset link.`,
    );
    // TODO: wire up POST /auth/forgot-password with { email } once API
    // integration begins
  }

  return (
    <div className={styles.page}>
      <p className={styles.brand}>PersonaLearn</p>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Log in to pick up where you left off.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
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
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <button type="button" className={styles.forgot} onClick={handleForgotPassword}>
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {forgotPasswordMessage && <p className={styles.success}>{forgotPasswordMessage}</p>}
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
