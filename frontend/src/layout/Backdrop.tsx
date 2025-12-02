import { useAppStore } from '../store/app.store';
import styles from './Backdrop.module.scss';

const Backdrop = () => {
  const { toggleSidebar } = useAppStore();
  return <div className={styles.backdrop} onClick={toggleSidebar} />;
};

export default Backdrop;
