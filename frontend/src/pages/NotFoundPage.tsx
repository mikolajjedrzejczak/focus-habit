import styles from './NotFoundPage.module.scss';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Ups! Strona nie istnieje</h2>
        <p className={styles.description}>
          Wygląda na to, że zabłądziłeś. Strona, której szukasz, została usunięta lub adres jest niepoprawny.
        </p>
        <a href="/" className={styles.homeButton}>
          Wróć na stronę główną
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;