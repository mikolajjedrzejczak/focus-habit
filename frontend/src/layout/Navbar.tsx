import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import styles from './Navbar.module.scss';

export const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navbar__brand}>
        FocusHabit
      </Link>
      <div className={styles.navbar__user_info}>
        <span className={styles.navbar__email}>
          {user?.email}
        </span>
        <button onClick={handleLogout} className={styles.navbar__logout_button}>
          Wyloguj
        </button>
      </div>
    </nav>
  );
};
