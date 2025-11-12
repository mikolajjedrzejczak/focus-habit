import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { Navbar } from '../layout/Navbar';
import styles from './DashboardPage.module.scss';
import { isHabitDoneToday } from '../utils/date.helpers';

const DashboardPage = () => {
  const {
    habits,
    isLoadingHabits,
    habitsError,
    createHabit,
    isCreatingHabit,
    toggleHabit,
    isTogglingHabit,
    deleteHabit,
    isDeletingHabit,
  } = useHabits();

  const [newHabitName, setNewHabitName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    createHabit(newHabitName);
    setNewHabitName('');
  };

  const isOperationPending =
    isCreatingHabit || isTogglingHabit || isDeletingHabit;

  return (
    <div className={styles.dashboard}>
      <Navbar />
      <main className={styles.dashboard__main_content}>
        <h1 className={styles.dashboard__header}>Twój Panel Nawyków</h1>

        <form onSubmit={handleCreateSubmit} className={styles.create_form}>
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Nowy nawyk (np. 'Pobiegać')"
            disabled={isCreatingHabit}
            className={styles.create_form__input}
          />
          <button
            type="submit"
            disabled={isCreatingHabit}
            className={styles.create_form__button}
          >
            {isCreatingHabit ? 'Dodawanie...' : 'Dodaj'}
          </button>
        </form>

        {isLoadingHabits && <p>Ładowanie nawyków...</p>}
        {habitsError && (
          <p style={{ color: 'red' }}>Nie udało się załadować nawyków.</p>
        )}

        <ul className={styles.habit_list}>
          {habits &&
            habits.map((habit) => {
              const isDone = isHabitDoneToday(habit);

              return (
                <li key={habit.id} className={styles.habit_list__item}>
                  <span
                    className={`${styles.habit_list__name} ${
                      isDone ? styles.habit_list__name_done : ''
                    }`}
                  >
                    {habit.name}
                  </span>
                  <div className={styles.habit_list__actions}>
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      disabled={isOperationPending}
                      className={`${styles.habit_list__toggle_button} ${
                        isDone ? styles.habit_list__toggle_button_done : ''
                      }`}
                    >
                      {isDone ? 'Cofnij' : 'Zrobione!'}
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      disabled={isOperationPending}
                      className={styles.habit_list__delete_button}
                    >
                      Usuń
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      </main>
    </div>
  );
};

export default DashboardPage;
