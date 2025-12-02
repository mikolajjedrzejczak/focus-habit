import type { HabitList } from '../../types/habit.types';
import { AddHabitForm } from './AddHabitForm';
import HabitCard from './HabitCard';
import styles from './HabitListContent.module.scss';

interface HabitListContentProps {
  list: HabitList | undefined;
}

const HabitListContent = ({ list }: HabitListContentProps) => {
  if (!list) {
    return (
      <div className={`${styles.content} ${styles.content_empty}`}>
        <h2>Wybierz listę z panelu bocznego, aby zacząć</h2>
        <p>Lub stwórz nową listę!</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={styles.content__header}>{list.name}</h1>

      <div className={styles.content__addForm}>
        <AddHabitForm listId={list.id} />
      </div>

      <ul className={styles.habitList}>
        {list.habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </ul>
    </div>
  );
};

export default HabitListContent;
