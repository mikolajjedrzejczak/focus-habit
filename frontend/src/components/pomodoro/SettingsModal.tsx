import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/app.store.js';
import { Modal } from '../common/Modal.js';
import styles from './SettingsModal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: Props) => {
  const { timerSettings, updateTimerSettings } = useAppStore();
  const [values, setValues] = useState(timerSettings);

  useEffect(() => {
    if (isOpen) setValues(timerSettings);
  }, [isOpen, timerSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    setValues((prev) => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
  };

  const handleSave = () => {
    updateTimerSettings(values);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ustawienia Timera">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Praca (minuty)</label>
          <input
            type="number"
            name="work"
            value={values.work}
            onChange={handleChange}
            min="1"
            max="120"
          />
        </div>

        <div className={styles.field}>
          <label>Krótka Przerwa (minuty)</label>
          <input
            type="number"
            name="shortBreak"
            value={values.shortBreak}
            onChange={handleChange}
            min="1"
            max="60"
          />
        </div>

        <div className={styles.field}>
          <label>Długa Przerwa (minuty)</label>
          <input
            type="number"
            name="longBreak"
            value={values.longBreak}
            onChange={handleChange}
            min="1"
            max="60"
          />
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Anuluj
          </button>
          <button onClick={handleSave} className={styles.saveBtn}>
            Zapisz
          </button>
        </div>
      </div>
    </Modal>
  );
};
