import { useNavigate } from 'react-router-dom';
import { useHabitLists } from '../../hooks/useHabitLists.js';
import type { Habit } from '../../types/habit.types.js';
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  isHabitDoneToday,
} from '../../utils/date.utils.js';
import styles from './HabitCard.module.scss';
import { useAppStore } from '../../store/app.store.js';
import { useModal } from '../../hooks/useModal.js';
import { ConfirmationModal } from '../common/ConfirmationModal.js';

interface habitCardProps {
  habit: Habit;
}

const HabitCard = ({ habit }: habitCardProps) => {
  const navigate = useNavigate();
  const { setFocusHabitId } = useAppStore();

  const { toggleHabit, isTogglingHabit, deleteHabit, isDeletingHabit } =
    useHabitLists();

  const { isOpen, openModal, closeModal } = useModal();

  const isDone = isHabitDoneToday(habit);

  const isOperationPending = isTogglingHabit || isDeletingHabit;

  const currentStreak = calculateCurrentStreak(habit.entries);
  const longestStreak = calculateLongestStreak(habit.entries);

  const confirmDelete = () => {
    deleteHabit(habit.id);
    closeModal();
  };

  const startFocus = () => {
    setFocusHabitId(habit.id);
    navigate('/pomodoro');
  };

  return (
    <>
      <li className={styles.habitCard}>
        <div className={styles.habitCard__header}>
          <div className={styles.habitCard__info}>
            <span
              className={`${styles.habitCard__name} ${
                isDone ? styles.habitCard__name_done : ''
              }`}
            >
              {habit.name}
            </span>

            <div className={styles.habitCard__stats}>
              {currentStreak > 0 && (
                <span
                  className={`${styles.habitCard__stat} ${styles.habitCard__stat_current}`}
                >
                  {currentStreak} {currentStreak === 1 ? 'dzień' : 'dni'} serii!
                </span>
              )}
              {longestStreak > 1 && (
                <span
                  className={`${styles.habitCard__stat} ${styles.habitCard__stat_longest}`}
                >
                  🏆 Rekord: {longestStreak}
                </span>
              )}
            </div>
          </div>

          <div className={styles.habitCard__actions}>
            {!isDone && (
              <button
                onClick={startFocus}
                className={styles.habitCard__focusButton}
              >
                Focus
              </button>
            )}
            <button
              onClick={() => toggleHabit(habit.id)}
              disabled={isOperationPending}
              className={`${styles.habitCard__toggleButton} ${
                isDone ? styles.habitCard__toggleButton_done : ''
              }`}
            >
              {isDone ? 'Cofnij' : 'Zrobione!'}
            </button>
            <button
              onClick={openModal}
              disabled={isOperationPending}
              className={styles.habitCard__deleteButton}
            >
              Usuń
            </button>
          </div>
        </div>
      </li>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Usuń nawyk"
        message={`Czy na pewno chcesz usunąć nawyk "${habit.name}"?`}
        confirmText="Usuń"
        variant="danger"
        isPending={isDeletingHabit}
      />
    </>
  );
};

export default HabitCard;
