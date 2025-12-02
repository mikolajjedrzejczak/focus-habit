import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils/date.utils';
import { useAppStore } from '../store/app.store';
import { toggleHabitRequest } from '../services/habit.service';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export const usePomodoro = () => {
  const { focusHabitId, setFocusHabitId, timerSettings } = useAppStore();

  const getTimeForMode = (currentMode: TimerMode): number => {
    switch (currentMode) {
      case 'work':
        return timerSettings.work * 60;
      case 'shortBreak':
        return timerSettings.shortBreak * 60;
      case 'longBreak':
        return timerSettings.longBreak * 60;
      default:
        return 25 * 60;
    }
  };

  const [mode, setMode] = useState<TimerMode>('work');
  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    getTimeForMode('work')
  );
  const [isActive, setIsActive] = useState(false);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setSecondsLeft(getTimeForMode(mode));
    }
  }, [timerSettings, mode]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsActive(false);

            const audio = new Audio('/bell.mp3');
            audio
              .play()
              .catch((e) => console.error('Błąd odtwarzania dźwięku:', e));

            if (mode === 'work' && focusHabitId) {
              toggleHabitRequest(focusHabitId).catch((err) =>
                console.error('Błąd zapisu Pomodoro:', err)
              );

              setFocusHabitId(null);
            }

            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, mode, focusHabitId]);

  const startTimer = () => {
    if (secondsLeft > 0) {
      setIsActive(true);
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setSecondsLeft(getTimeForMode(newMode));
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(getTimeForMode(mode));
  };

  return {
    mode,
    isActive,
    secondsLeft,
    formattedTime: formatTime(secondsLeft),
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
  };
};
