import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon, CheckIcon } from '../../components/icons';
import styles from './AddChildPage.module.css';

const AVATAR_COLORS = ['#ff3f00', '#1f9d68', '#d9670a', '#3a6ea5', '#8a5cd6', '#c2417e'];

export function AddChildPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire up a real "create child profile" endpoint once one exists
    navigate('/parent');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate('/parent')}>
          <ArrowLeftIcon size={14} />
          Back to Your Children
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Add a child</h1>
        <p className={styles.subtitle}>Create a profile for your child — no email or password needed.</p>

        <div className={styles.preview}>
          <span className={styles.previewAvatar} style={{ background: avatarColor }}>
            {name.trim() ? name.trim().charAt(0).toUpperCase() : '?'}
          </span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              className={styles.input}
              placeholder="Maya"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Avatar color</span>
            <div className={styles.swatchRow}>
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={styles.swatch}
                  style={{ background: color }}
                  onClick={() => setAvatarColor(color)}
                  aria-label={`Choose ${color} avatar color`}
                  aria-pressed={avatarColor === color}
                >
                  {avatarColor === color && <CheckIcon size={14} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submit}>
            Add Child
          </button>
        </form>
      </div>
    </div>
  );
}
