import { useState } from 'react';
import { ClockIcon, LayersIcon, TagIcon, CheckIcon, ArrowRightIcon } from '../../components/icons';
import styles from './PersonalizedOverview.module.css';

export interface PersonalizedOverviewLesson {
  lessonNumber: number;
  lessonTitle: string;
  duration: string;
  isCompleted?: boolean;
}

export interface PersonalizedOverviewModule {
  moduleNumber: number;
  moduleTitle: string;
  lessons: PersonalizedOverviewLesson[];
}

// Mirrors the new student-facing fields on UserCurriculum.metadata
// (PersonalizedMetadata) — only populated after a real enroll call.
// `modules`/`overallProgress` mirror UserCurriculum.modules/overallProgress directly.
export interface PersonalizedOverviewData {
  courseTitle: string;
  summary: string;
  learningObjectives: string[];
  keyTakeaways: string[];
  sourceType: string;
  estimatedTotalDuration: string;
  totalModules: number;
  overallProgress: number;
  modules: PersonalizedOverviewModule[];
}

interface PersonalizedOverviewProps {
  overview: PersonalizedOverviewData;
  onContinue: () => void;
}

export function PersonalizedOverview({ overview, onContinue }: PersonalizedOverviewProps) {
  const [expandedModule, setExpandedModule] = useState<number | null>(
    overview.modules[0]?.moduleNumber ?? null,
  );

  return (
    <>
      <span className={styles.badge}>{overview.sourceType}</span>
      <h1 className={styles.title}>{overview.courseTitle}</h1>
      <p className={styles.description}>{overview.summary}</p>

      <div className={styles.statRow}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>
            <ClockIcon size={18} />
          </span>
          <p className={styles.statLabel}>Duration</p>
          <p className={styles.statValue}>{overview.estimatedTotalDuration}</p>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>
            <LayersIcon size={18} />
          </span>
          <p className={styles.statLabel}>Modules</p>
          <p className={styles.statValue}>{overview.totalModules}</p>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>
            <TagIcon size={18} />
          </span>
          <p className={styles.statLabel}>Source</p>
          <p className={styles.statValue}>{overview.sourceType}</p>
        </div>
      </div>

      <div className={styles.progressBlock}>
        <div className={styles.progressHeader}>
          <h2 className={styles.sectionTitle}>Course Progress</h2>
          <span className={styles.progressPercent}>{overview.overallProgress}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${overview.overallProgress}%` }} />
        </div>
      </div>

      <div className={styles.listBlock}>
        <h2 className={styles.sectionTitle}>Modules</h2>
        <div className={styles.moduleList}>
          {overview.modules.map((module) => {
            const isOpen = expandedModule === module.moduleNumber;
            return (
              <div key={module.moduleNumber} className={styles.moduleCard}>
                <button
                  type="button"
                  className={styles.moduleHeader}
                  onClick={() => setExpandedModule(isOpen ? null : module.moduleNumber)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.moduleHeaderText}>
                    <span className={styles.moduleEyebrow}>Module {module.moduleNumber}</span>
                    <span className={styles.moduleTitle}>{module.moduleTitle}</span>
                  </span>
                  <span className={isOpen ? styles.chevronOpen : styles.chevron}>
                    <ArrowRightIcon size={14} />
                  </span>
                </button>

                {isOpen && (
                  <ul className={styles.lessonList}>
                    {module.lessons.map((lesson) => (
                      <li key={lesson.lessonNumber} className={styles.lessonItem}>
                        <span className={lesson.isCompleted ? styles.lessonIconDone : styles.lessonIcon}>
                          {lesson.isCompleted ? (
                            <CheckIcon size={11} strokeWidth={3} />
                          ) : (
                            <span className={styles.lessonDot} />
                          )}
                        </span>
                        <span className={styles.lessonTitle}>{lesson.lessonTitle}</span>
                        <span className={styles.lessonDuration}>{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.listBlock}>
        <h2 className={styles.sectionTitle}>What You'll Learn</h2>
        <ul className={styles.list}>
          {overview.learningObjectives.map((objective) => (
            <li key={objective} className={styles.listItem}>
              <span className={styles.listItemIcon}>
                <CheckIcon size={12} strokeWidth={3} />
              </span>
              {objective}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.listBlock}>
        <h2 className={styles.sectionTitle}>Key Takeaways</h2>
        <ul className={styles.list}>
          {overview.keyTakeaways.map((takeaway) => (
            <li key={takeaway} className={styles.listItem}>
              <span className={styles.listItemDot} />
              {takeaway}
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className={styles.continueButton} onClick={onContinue}>
        Continue Learning
      </button>
    </>
  );
}
