import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/app.store';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { useModal } from '../hooks/useModal';

export const Navbar = () => {
  const { handleLogout } = useAuth();

  const { isOpen, openModal, closeModal } = useModal();

  const { toggleSidebar } = useAppStore();

  return (
    <>
      <nav className={styles.navbar}>
        <button onClick={toggleSidebar} className={styles.navbar__hamburger}>
          ☰
        </button>
        <Link to="/" className={styles.navbar__brand}>
          FocusHabit
        </Link>
        <div className={styles.navbar__linksContainer}>
          <Link to="/" className={styles.navbar__link}>
            Strona Główna
          </Link>
          <Link to="/pomodoro" className={styles.navbar__link}>
            Pomodoro
          </Link>
        </div>

        <div className={styles.navbar__actions}>
          <button onClick={openModal} className={styles.navbar__logout}>
            Wyloguj
          </button>
        </div>
      </nav>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleLogout}
        title="wyloguj"
        message="Czy napewno chcesz się wylogować?"
      />
    </>
  );
};
