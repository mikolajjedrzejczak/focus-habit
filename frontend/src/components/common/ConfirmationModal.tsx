import { Modal } from './Modal.js';
import styles from './ConfirmationModal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isPending?: boolean;
  variant?: 'danger' | 'neutral';
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Potwierdź',
  isPending,
  variant = 'danger',
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.container}>
        <p className={styles.message} dangerouslySetInnerHTML={{ __html: message}}></p>

        <div className={styles.actions}>
          <button
            onClick={onClose}
            disabled={isPending}
            className={styles.cancelBtn}
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`${styles.confirmBtn} ${
              variant === 'danger' ? styles.danger : ''
            }`}
          >
            {isPending ? 'Przetwarzanie...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
