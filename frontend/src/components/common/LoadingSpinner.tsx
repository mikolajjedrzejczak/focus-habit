import styles from './LoadingSpinner.module.scss';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'fullScreen' | 'centered' | 'inline';
}

export const LoadingSpinner = ({
  size = 'md',
  variant = 'centered',
}: Props) => {
  if (variant === 'inline') {
    return <div className={`${styles.spinner} ${styles[size]}`} />;
  }

  return (
    <div className={`${styles.spinnerContainer} ${styles[variant]}`}>
      <div className={`${styles.spinner} ${styles[size]}`} />
    </div>
  );
};
