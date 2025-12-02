import { IoIosSettings } from 'react-icons/io';
import { useMemo } from 'react';
import { useHabitLists } from '../hooks/useHabitLists';
import { usePomodoro } from '../hooks/usePomodoro';
import Backdrop from '../layout/Backdrop';
import { Navbar } from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import { useAppStore } from '../store/app.store';
import styles from './PomodoroPage.module.scss';
import { isHabitDoneToday } from '../utils/date.utils';
import { useModal } from '../hooks/useModal';
import { SettingsModal } from '../components/pomodoro/SettingsModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

const PomodoroPage = () => {
  const {
    mode,
    isActive,
    formattedTime,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
  } = usePomodoro();

  const { focusHabitId, setFocusHabitId, isSidebarOpen, selectedListId } =
    useAppStore();
  const { habitLists, isLoadingLists } = useHabitLists();

  const trackedHabit = useMemo(
    () =>
      habitLists?.flatMap((l) => l.habits).find((h) => h.id === focusHabitId),
    [habitLists, focusHabitId]
  );

  const currentListHabits = useMemo(() => {
    const list = habitLists?.find((l) => l.id === selectedListId);
    if (!list) return [];
    return list.habits.filter((habit) => !isHabitDoneToday(habit));
  }, [habitLists, selectedListId]);

  const {
    isOpen: isSettingsOpen,
    openModal: openSettingsModal,
    closeModal: closeSettingsModal,
  } = useModal();

  const {
    isOpen: isResetOpen,
    openModal: openResetModal,
    closeModal: closeResetModal,
  } = useModal();

  const handleResetConfirm = () => {
    resetTimer();
    closeResetModal();
  };

  return (
    <div className={styles.pomodoroPage}>
      <Navbar />
      {isSidebarOpen && <Backdrop />}
      <div
        className={`${styles.pomodoroLayout} ${
          isSidebarOpen ? styles.pomodoroLayout_sidebarOpen : ''
        }`}
      >
        <Sidebar lists={habitLists || []} isLoading={isLoadingLists} />

        <main className={styles.content}>
          <div className={styles.timerContainer}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={openSettingsModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                }}
              >
                <IoIosSettings />
              </button>
            </div>
            <div className={styles.focusHeader}>
              <p className={styles.trackedHabit}>
                {trackedHabit
                  ? `🔥 Skupiasz się na: ${trackedHabit.name}`
                  : 'Wybierz zadanie poniżej 👇'}
              </p>
            </div>
            <div className={styles.modeButtons}>
              <button
                className={`${styles.modeButton} ${
                  mode === 'work' ? styles.modeButton_active : ''
                }`}
                onClick={() => changeMode('work')}
              >
                Praca
              </button>
              <button
                className={`${styles.modeButton} ${
                  mode === 'shortBreak' ? styles.modeButton_active : ''
                }`}
                onClick={() => changeMode('shortBreak')}
              >
                Krótka Przerwa
              </button>
              <button
                className={`${styles.modeButton} ${
                  mode === 'longBreak' ? styles.modeButton_active : ''
                }`}
                onClick={() => changeMode('longBreak')}
              >
                Długa Przerwa
              </button>
            </div>
            <div className={styles.timer}>{formattedTime}</div>
            <div className={styles.controlButtons}>
              {!isActive ? (
                <button
                  className={`${styles.controlButton} ${styles.controlButton_start}`}
                  onClick={startTimer}
                >
                  Start
                </button>
              ) : (
                <button
                  className={`${styles.controlButton} ${styles.controlButton_pause}`}
                  onClick={pauseTimer}
                >
                  Pauza
                </button>
              )}
              <button
                className={`${styles.controlButton} ${styles.controlButton_reset}`}
                onClick={openResetModal}
              >
                Reset
              </button>
            </div>
            {!isActive && currentListHabits.length > 0 && (
              <div className={styles.quickSelect}>
                <p>Szybka zmiana zadania (z wybranej listy):</p>
                <select
                  onChange={(e) => setFocusHabitId(e.target.value)}
                  value={focusHabitId || ''}
                  className={styles.habitSelect}
                >
                  <option value="" disabled>
                    Wybierz nawyk...
                  </option>
                  {currentListHabits.map((habit) => (
                    <option key={habit.id} value={habit.id}>
                      {habit.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </main>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettingsModal} />
      <ConfirmationModal
        isOpen={isResetOpen}
        onClose={closeResetModal}
        onConfirm={handleResetConfirm}
        title="Zresetuj licznik"
        message="Czy na pewno chcesz zresetować zegar?"
        confirmText="zresetuj"
        variant="danger"
      />
    </div>
  );
};

export default PomodoroPage;
