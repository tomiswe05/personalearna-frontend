import { useNavigate, useParams } from 'react-router';
import { ArrowLeftIcon } from '../../components/icons';
import { UploadIllustration } from '../../components/UploadIllustration';
import styles from './AvatarChoicePage.module.css';

// Real placeholder face photos (no live HeyGen data yet) — swap for actual
// avatar preview_image_urls from GET /heygen/avatars once wired up.
const TEASER_AVATAR_URLS = [
  'https://i.pravatar.cc/120?img=12',
  'https://i.pravatar.cc/120?img=32',
  'https://i.pravatar.cc/120?img=45',
];

export function AvatarChoicePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  function handleUpload() {
    navigate(`/curriculum/${id}/avatar/upload`);
  }

  function handleBrowseLibrary() {
    navigate(`/curriculum/${id}/avatar/library`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate(`/curriculum/${id}/personalize`)}>
          <ArrowLeftIcon size={14} />
          Back
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Choose your avatar</h1>
        <p className={styles.subtitle}>
          Pick who teaches you — upload a photo of someone you choose, or pick a character from our library.
        </p>

        <div className={styles.splitRow}>
          <button type="button" className={styles.panel} onClick={handleUpload}>
            <UploadIllustration size={160} />
            <h2 className={styles.panelTitle}>Upload a photo</h2>
            <p className={styles.panelSubtitle}>
              Use a photo of anyone you'd like to be taught by.
            </p>
            <span className={styles.panelCta}>Upload Photo</span>
          </button>

          <div className={styles.dividerWrap}>
            <div className={styles.divider} />
          </div>

          <button type="button" className={styles.panel} onClick={handleBrowseLibrary}>
            <div className={styles.avatarStack}>
              {TEASER_AVATAR_URLS.map((url) => (
                <img key={url} src={url} alt="" className={styles.stackedAvatar} />
              ))}
            </div>
            <h2 className={styles.panelTitle}>Pick a character</h2>
            <p className={styles.panelSubtitle}>
              Choose from our library of ready-to-use avatars.
            </p>
            <span className={styles.panelCta}>Browse Characters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
