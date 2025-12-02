import { useState } from 'react';
import { useHabitLists } from '../../hooks/useHabitLists.js';
import styles from './AddHabitForm.module.scss';

interface AddHabitFormProps {
  listId: string; 
};

export const AddHabitForm = ({ listId }: AddHabitFormProps) => {
  const [name, setName] = useState('');
  const { createHabit, isCreatingHabit } = useHabitLists();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createHabit(
      { name, listId },
      { onSuccess: () => setName('') }
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.create_form}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nowy nawyk (np. 'Pobiegać')"
        disabled={isCreatingHabit}
        className={styles.create_form__input}
      />
      <button
        type="submit"
        disabled={isCreatingHabit}
        className={styles.create_form__button}
      >
        {isCreatingHabit ? '...' : '+ Dodaj'}
      </button>
    </form>
  );
};