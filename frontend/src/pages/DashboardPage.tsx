import { useEffect, useMemo } from 'react';
import { Navbar } from '../layout/Navbar';
import styles from './DashboardPage.module.scss';
import { useHabitLists } from '../hooks/useHabitLists';
import { useAppStore } from '../store/app.store';
import Sidebar from '../layout/Sidebar';
import HabitListContent from '../components/habits/HabitListContent';
import Backdrop from '../layout/Backdrop';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { habitLists, isLoadingLists, listsError } = useHabitLists();

  const { selectedListId, setSelectedListId, isSidebarOpen } = useAppStore();

  useEffect(() => {
    if (!selectedListId && habitLists && habitLists.length > 0) {
      setSelectedListId(habitLists[0].id);
    }
  }, [habitLists, selectedListId, setSelectedListId]);

  const selectedList = useMemo(() => {
    return habitLists?.find((list) => list.id === selectedListId);
  }, [habitLists, selectedListId]);

  if (isLoadingLists) {
    return (
      <div className={styles.dashboardPage}>
        <Navbar />
        <LoadingSpinner size="lg" variant="centered" />
      </div>
    );
  }

  if (listsError) {
    return (
      <div>
        <Navbar />
        <p>Błąd ładowania danych.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Navbar />

      {isSidebarOpen && <Backdrop />}

      <div
        className={`${styles.dashboardLayout} ${
          isSidebarOpen ? styles.dashboardLayout_sidebarOpen : ''
        }`}
      >
        <Sidebar lists={habitLists || []} isLoading={isLoadingLists} />
        <HabitListContent list={selectedList} />
      </div>
    </div>
  );
};

export default DashboardPage;
