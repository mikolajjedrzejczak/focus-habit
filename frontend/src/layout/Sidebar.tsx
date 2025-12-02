import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import { useHabitLists } from '../hooks/useHabitLists';
import { useAppStore } from '../store/app.store';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../hooks/useModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { HabitList } from '../types/habit.types';

const HabitListItem = ({
  list,
  isActive,
  isDeleting,
  onSelect,
  onDelete,
}: {
  list: HabitList;
  isActive: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
}) => (
  <li>
    <button
      className={`${styles.navList__button} ${
        isActive ? styles.navList__button_active : ''
      }`}
      onClick={onSelect}
    >
      {list.name}
    </button>
    <button
      className={styles.navList__deleteButton}
      onClick={(e) => {
        e.stopPropagation();
        onDelete(list.id);
      }}
      disabled={isDeleting}
      aria-label="Usuń listę"
    >
      x
    </button>
  </li>
);

interface SidebarProps {
  lists: HabitList[];
  isLoading: boolean;
}

const Sidebar = ({ lists, isLoading }: SidebarProps) => {
  const { createList, isCreatingList, deleteList, isDeletingList } =
    useHabitLists();
  const { selectedListId, setSelectedListId, isSidebarOpen, toggleSidebar } =
    useAppStore();
  const { handleLogout } = useAuth();

  const [newListName, setNewListName] = useState('');
  const [listIdToDelete, setListIdToDelete] = useState<string | null>(null);

  const logoutModal = useModal();
  const deleteModal = useModal();

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createList(newListName, {
      onSuccess: (newList) => {
        setNewListName('');
        setSelectedListId(newList.data.id);
      },
    });
  };

  const handleDeleteClick = (id: string) => {
    setListIdToDelete(id);
    deleteModal.openModal();
  };

  const confirmDelete = () => {
    if (listIdToDelete) {
      deleteList(listIdToDelete);
      deleteModal.closeModal();
    }
  };

  const confirmLogout = () => {
    handleLogout();
    logoutModal.closeModal();
  };

  return (
    <>
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebar_open : ''
        }`}
      >
        <button className={styles.sidebar__closeBtn} onClick={toggleSidebar}>
          x
        </button>

        <div className={styles.sidebar__listContainer}>
          <form onSubmit={handleCreateList} className={styles.createListForm}>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Nowa lista..."
              disabled={isCreatingList}
              className={styles.createListForm__input}
            />
            <button type="submit" disabled={isCreatingList}>
              +
            </button>
          </form>

          <nav className={styles.navList}>
            {isLoading ? (
              <LoadingSpinner size="md" variant="centered" />
            ) : (
              <ul>
                {lists.map((list) => (
                  <HabitListItem
                    key={list.id}
                    list={list}
                    isActive={list.id === selectedListId}
                    isDeleting={isDeletingList}
                    onSelect={() => {
                      setSelectedListId(list.id);
                      toggleSidebar();
                    }}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </ul>
            )}
          </nav>
        </div>

        <div className={styles.sidebar__mobileNav}>
          <Link
            to="/"
            className={styles.sidebar__mobileNavLink}
            onClick={toggleSidebar}
          >
            Strona Główna
          </Link>
          <Link
            to="/pomodoro"
            className={styles.sidebar__mobileNavLink}
            onClick={toggleSidebar}
          >
            Pomodoro
          </Link>

          <hr className={styles.sidebar__mobileSeparator} />

          <button
            onClick={logoutModal.openModal}
            className={styles.sidebar__mobileLogoutButton}
          >
            Wyloguj
          </button>
          <hr className={styles.sidebar__mobileSeparator} />
        </div>
      </aside>

      <ConfirmationModal
        isOpen={logoutModal.isOpen}
        onClose={logoutModal.closeModal}
        onConfirm={confirmLogout}
        title="Wylogowanie"
        message="Czy napewno chcesz się wylogować?"
        confirmText="Wyloguj"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={confirmDelete}
        title="Usuń listę"
        message="Czy na pewno chcesz usunąć tę listę?<br /> Wszystkie nawyki w niej zawarte zostaną bezpowrotnie utracone."
        confirmText="Usuń listę"
        variant="danger"
        isPending={isDeletingList}
      />
    </>
  );
};

export default Sidebar;
