import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeftIcon, CheckIcon, SearchIcon } from '../../components/icons';
import type { HeyGenAvatar } from '../../types/heygen';
import styles from './AvatarLibraryPage.module.css';

// Placeholder faces standing in for real GET /heygen/avatars results —
// swap MOCK_AVATARS for the live response once that call is wired up.
const MOCK_AVATARS: HeyGenAvatar[] = [
  { id: '1', name: 'Ava', preview_image_url: 'https://i.pravatar.cc/300?img=47', gender: 'female' },
  { id: '2', name: 'Liam', preview_image_url: 'https://i.pravatar.cc/300?img=13', gender: 'male' },
  { id: '3', name: 'Zoe', preview_image_url: 'https://i.pravatar.cc/300?img=32', gender: 'female' },
  { id: '4', name: 'Noah', preview_image_url: 'https://i.pravatar.cc/300?img=52', gender: 'male' },
  { id: '5', name: 'Maya', preview_image_url: 'https://i.pravatar.cc/300?img=45', gender: 'female' },
  { id: '6', name: 'Ethan', preview_image_url: 'https://i.pravatar.cc/300?img=14', gender: 'male' },
  { id: '7', name: 'Priya', preview_image_url: 'https://i.pravatar.cc/300?img=48', gender: 'female' },
  { id: '8', name: 'Kofi', preview_image_url: 'https://i.pravatar.cc/300?img=51', gender: 'male' },
  { id: '9', name: 'Elena', preview_image_url: 'https://i.pravatar.cc/300?img=44', gender: 'female' },
];

export function AvatarLibraryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredAvatars = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_AVATARS;
    return MOCK_AVATARS.filter((avatar) => avatar.name.toLowerCase().includes(q));
  }, [query]);

  const selectedAvatar = MOCK_AVATARS.find((avatar) => avatar.id === selectedId) ?? null;

  function handleContinue() {
    if (!selectedAvatar) return;
    navigate(`/curriculum/${id}/lesson`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>PersonaLearn</span>
      </header>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={() => navigate(`/curriculum/${id}/avatar`)}>
          <ArrowLeftIcon size={14} />
          Back
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Pick a character</h1>
        <p className={styles.subtitle}>Choose from our library of ready-to-use avatars to teach your lesson.</p>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Search avatars..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.grid}>
          {filteredAvatars.map((avatar) => {
            const isSelected = avatar.id === selectedId;
            return (
              <button
                key={avatar.id}
                type="button"
                className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                onClick={() => setSelectedId(avatar.id)}
              >
                <div className={styles.photoWrap}>
                  <img src={avatar.preview_image_url} alt="" className={styles.photo} />
                  {isSelected && (
                    <span className={styles.checkBadge}>
                      <CheckIcon size={14} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className={styles.name}>{avatar.name}</span>
              </button>
            );
          })}
        </div>

        {filteredAvatars.length === 0 && (
          <p className={styles.emptyState}>No avatars match "{query}".</p>
        )}
      </div>

      <div className={styles.continueBar}>
        <div className={styles.continueInner}>
          <div className={styles.continueInfo}>
            {selectedAvatar ? (
              <>
                <img src={selectedAvatar.preview_image_url} alt="" className={styles.continueThumb} />
                <span className={styles.continueLabel}>{selectedAvatar.name} selected</span>
              </>
            ) : (
              <span className={styles.continueLabel}>Select a character to continue</span>
            )}
          </div>
          <button
            type="button"
            className={styles.continueButton}
            disabled={!selectedAvatar}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
