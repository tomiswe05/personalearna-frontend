import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '../../components/icons';
import styles from './TeacherInvitePage.module.css';

// Placeholder — real value comes from GET /users/me once API integration begins.
const MOCK_CLASS_CODE = 'BIOCLASS';

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Share your code',
    description: 'Share this code with your student — text, email, or say it out loud in class.',
  },
  {
    title: 'They join your class',
    description: 'They enter it on the "Join a Class" screen from their own account.',
  },
  {
    title: 'Start assigning',
    description: "Once they join, they'll show up on your Dashboard and you can start assigning material.",
  },
];

export function TeacherInvitePage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(MOCK_CLASS_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the
      // code is still visible on screen to copy manually.
    }
  }

  const step = HOW_IT_WORKS_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === HOW_IT_WORKS_STEPS.length - 1;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate('/teacher')}>
          <ArrowLeftIcon size={14} />
          Back to Dashboard
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Invite Students</h1>
        <p className={styles.subtitle}>
          Share this code with your students so they can join your class.
        </p>

        <div className={styles.codeCard}>
          <span className={styles.codeText}>{MOCK_CLASS_CODE}</span>
          <button type="button" className={styles.copyButton} onClick={handleCopy}>
            {copied ? (
              <>
                <CheckIcon size={14} strokeWidth={3} />
                Copied!
              </>
            ) : (
              'Copy Code'
            )}
          </button>
        </div>

        <div className={styles.instructions}>
          <h2 className={styles.instructionsTitle}>How it works</h2>

          <div className={styles.carousel}>
            <div key={stepIndex} className={styles.carouselSlide}>
              <span className={styles.stepNumber}>{stepIndex + 1}</span>
              <p className={styles.stepTitle}>{step.title}</p>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>

            <div className={styles.carouselNav}>
              <button
                type="button"
                className={styles.navArrow}
                onClick={() => setStepIndex((i) => i - 1)}
                disabled={isFirst}
                aria-label="Previous step"
              >
                <ArrowLeftIcon size={16} />
              </button>

              <div className={styles.dots}>
                {HOW_IT_WORKS_STEPS.map((dotStep, index) => (
                  <button
                    key={dotStep.title}
                    type="button"
                    className={index === stepIndex ? styles.dotActive : styles.dot}
                    onClick={() => setStepIndex(index)}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className={styles.navArrow}
                onClick={() => setStepIndex((i) => i + 1)}
                disabled={isLast}
                aria-label="Next step"
              >
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
