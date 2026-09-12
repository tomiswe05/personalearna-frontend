import { Fragment, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { LearningStyle, LearningPace, MediaPreference } from '../../types/curriculum';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '../../components/icons';
import styles from './PersonalizationFormPage.module.css';

interface OptionDef<T extends string> {
  value: T;
  label: string;
  description: string;
}

const LEARNING_STYLE_OPTIONS: OptionDef<LearningStyle>[] = [
  { value: 'visual', label: 'Visual', description: 'Learn through diagrams, imagery, and visual demonstrations.' },
  { value: 'audio', label: 'Audio', description: 'Learn best by listening to narration and spoken explanation.' },
  { value: 'reading', label: 'Reading', description: 'Prefer reading text and written explanations.' },
  { value: 'kinesthetic', label: 'Kinesthetic', description: 'Learn by doing hands-on, practical examples.' },
];

const LEARNING_PACE_OPTIONS: OptionDef<LearningPace>[] = [
  { value: 'slow', label: 'Slow', description: 'Take it step by step, with plenty of detail.' },
  { value: 'moderate', label: 'Moderate', description: 'A balanced pace not too fast, not too slow.' },
  { value: 'fast', label: 'Fast', description: 'Move quickly through the material, cover more ground.' },
];

const MEDIA_PREFERENCE_OPTIONS: OptionDef<MediaPreference>[] = [
  { value: 'video', label: 'Video', description: 'Watch an avatar-led video lesson.' },
  { value: 'audio', label: 'Audio', description: 'Listen to an audio-only lesson.' },
  { value: 'text', label: 'Text', description: 'Read the lesson as text.' },
  { value: 'mixed', label: 'Mixed', description: 'A mix of video, audio, and text.' },
];

const STEP_LABELS = ['Learning Style', 'Pace', 'Media Pref.', 'Extra Notes'];
const TOTAL_STEPS = STEP_LABELS.length;


export function PersonalizationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [learningPace, setLearningPace] = useState<LearningPace | null>(null);
  const [mediaPreference, setMediaPreference] = useState<MediaPreference | null>(null);
  const [additionalPreferences, setAdditionalPreferences] = useState('');

  function goNext() {
    setDirection('forward');
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setDirection('back');
    setStep((s) => Math.max(s - 1, 0));
  }

  // Selecting a card advances automatically after a brief pause, so the
  // user sees the selection's pulse animation land before moving on.
  function selectAndAdvance(apply: () => void) {
    apply();
    setDirection('forward');
    setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), 350);
  }

  function handleFinish() {
    // Avatar Picker only makes sense when a video is actually being
    // generated — text/audio-only lessons have nothing to attach an
    // avatar to, so skip straight past it for those.
    const needsAvatar = mediaPreference === 'video' || mediaPreference === 'mixed';

    // TODO: combine this step's answers (+ Avatar Picker's, if visited)
    // and call POST /curriculum/:id/enroll once API integration begins
    navigate(needsAvatar ? `/curriculum/${id}/avatar` : `/curriculum/${id}/lesson`);
  }

  const canGoNext =
    (step === 0 && learningStyle !== null) ||
    (step === 1 && learningPace !== null) ||
    (step === 2 && mediaPreference !== null) ||
    step === 3;

  const stepAnimClass = direction === 'forward' ? styles.stepForward : styles.stepBack;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate(`/curriculum/${id}`)}>
          <ArrowLeftIcon />
          Back
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.tracker}>
          {STEP_LABELS.map((label, index) => (
            <Fragment key={label}>
              <div className={styles.trackerStep}>
                <div
                  className={
                    index < step
                      ? `${styles.trackerCircle} ${styles.trackerCircleDone}`
                      : index === step
                        ? `${styles.trackerCircle} ${styles.trackerCircleActive}`
                        : styles.trackerCircle
                  }
                >
                  {index < step ? <CheckIcon size={14} strokeWidth={3} /> : index + 1}
                </div>
                <span
                  className={
                    index <= step ? `${styles.trackerLabel} ${styles.trackerLabelActive}` : styles.trackerLabel
                  }
                >
                  {label}
                </span>
              </div>
              {index < STEP_LABELS.length - 1 && (
                <div className={index < step ? `${styles.trackerLine} ${styles.trackerLineDone}` : styles.trackerLine} />
              )}
            </Fragment>
          ))}
        </div>

        <div className={styles.stepWrap}>
          <div key={step} className={stepAnimClass}>
            {step === 0 && (
              <>
                <h1 className={styles.stepTitle}>How do you learn best?</h1>
                <p className={styles.stepSubtitle}>Pick the style that fits you.</p>
                <div className={styles.optionGrid}>
                  {LEARNING_STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={
                        learningStyle === opt.value
                          ? `${styles.optionCard} ${styles.optionCardSelected}`
                          : styles.optionCard
                      }
                      onClick={() => selectAndAdvance(() => setLearningStyle(opt.value))}
                    >
                      <span
                        className={
                          learningStyle === opt.value
                            ? `${styles.radioDot} ${styles.radioDotSelected}`
                            : styles.radioDot
                        }
                      >
                        <span className={styles.radioDotInner} />
                      </span>
                      <span>
                        <p className={styles.optionLabel}>{opt.label}</p>
                        <p className={styles.optionDescription}>{opt.description}</p>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className={styles.stepTitle}>What pace works for you?</h1>
                <p className={styles.stepSubtitle}>How quickly should we move through the material?</p>
                <div className={styles.optionGrid}>
                  {LEARNING_PACE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={
                        learningPace === opt.value
                          ? `${styles.optionCard} ${styles.optionCardSelected}`
                          : styles.optionCard
                      }
                      onClick={() => selectAndAdvance(() => setLearningPace(opt.value))}
                    >
                      <span
                        className={
                          learningPace === opt.value
                            ? `${styles.radioDot} ${styles.radioDotSelected}`
                            : styles.radioDot
                        }
                      >
                        <span className={styles.radioDotInner} />
                      </span>
                      <span>
                        <p className={styles.optionLabel}>{opt.label}</p>
                        <p className={styles.optionDescription}>{opt.description}</p>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className={styles.stepTitle}>How should we teach it?</h1>
                <p className={styles.stepSubtitle}>Choose your preferred lesson format.</p>
                <div className={styles.optionGrid}>
                  {MEDIA_PREFERENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={
                        mediaPreference === opt.value
                          ? `${styles.optionCard} ${styles.optionCardSelected}`
                          : styles.optionCard
                      }
                      onClick={() => selectAndAdvance(() => setMediaPreference(opt.value))}
                    >
                      <span
                        className={
                          mediaPreference === opt.value
                            ? `${styles.radioDot} ${styles.radioDotSelected}`
                            : styles.radioDot
                        }
                      >
                        <span className={styles.radioDotInner} />
                      </span>
                      <span>
                        <p className={styles.optionLabel}>{opt.label}</p>
                        <p className={styles.optionDescription}>{opt.description}</p>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className={styles.stepTitle}>Anything else?</h1>
                <p className={styles.stepSubtitle}>Optional — add any extra notes for your lesson.</p>
                <textarea
                  className={styles.textarea}
                  placeholder="e.g. Keep it beginner-friendly, focus on practical examples..."
                  value={additionalPreferences}
                  onChange={(event) => setAdditionalPreferences(event.target.value)}
                />
              </>
            )}
          </div>
        </div>

        <div className={styles.navRow}>
          <p className={styles.helperText}>
            {step < 3 ? 'Select an option to continue' : 'Optional — you can leave this blank'}
          </p>
          <div className={styles.navButtons}>
            <button type="button" className={styles.navArrow} onClick={goBack} disabled={step === 0}>
              <ArrowLeftIcon />
            </button>
            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                className={`${styles.navArrow} ${styles.navArrowPrimary}`}
                onClick={goNext}
                disabled={!canGoNext}
              >
                <ArrowRightIcon />
              </button>
            ) : (
              <button type="button" className={styles.finishButton} onClick={handleFinish}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
