import {
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import styles from './VerifyEmailPage.module.css';

const CODE_LENGTH = 6;

export function VerifyEmailPage() {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Updates just one box's digit in the `digits` array, keeping the other 5 untouched.
  function setDigit(index: number, value: string) {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  // Runs every time a user types into one box. Strips non-digits, keeps only
  // the last character typed (so overtyping a filled box replaces it, not
  // appends), and auto-focuses the next box so typing feels continuous.
  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\D/g, '');

    if (!value) {
      setDigit(index, '');
      return;
    }

    setDigit(index, value[value.length - 1]);

    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Backspace on an already-empty box jumps focus back to the previous box
  // and clears it too — matches how OTP inputs normally behave elsewhere.
  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, '');
    }
  }

  // Lets a user paste a full 6-digit code anywhere in the row instead of
  // typing each digit — spreads the pasted digits across all 6 boxes at once.
  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;

    event.preventDefault();
    setDigits(Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? ''));
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  // Combines the 6 boxes back into one code string, checks it's a full
  // 6-digit number, and (once wired up) sends it to the backend to verify.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = digits.join('');

    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code we sent to your email.');
      return;
    }

    setError(null);
    // TODO: wire up POST /users/verify-email once API integration begins
  }

  // Disables the resend button immediately (stand-in for the backend's real
  // cooldown, which isn't wired up yet) so a user can't spam-click it.
  function handleResend() {
    setResendDisabled(true);
    // TODO: wire up POST /users/resend-verification-code once API
    // integration begins — re-enable once the real cooldown expires
  }

  return (
    <div className={styles.page}>
      <p className={styles.brand}>PersonaLearn</p>
      <div className={styles.card}>
        <h1 className={styles.title}>Verify your email</h1>
        <p className={styles.subtitle}>
          Enter the 6-digit code we sent to your email to activate your account.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.codeRow}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={styles.codeBox}
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
              />
            ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit}>
            Verify Email
          </button>
        </form>

        <div className={styles.divider}>Didn't receive it?</div>

        <p className={styles.footer}>
          <button
            type="button"
            className={styles.resend}
            onClick={handleResend}
            disabled={resendDisabled}
          >
            {resendDisabled ? 'Code sent — check your inbox' : 'Resend code'}
          </button>
        </p>
      </div>
    </div>
  );
}
