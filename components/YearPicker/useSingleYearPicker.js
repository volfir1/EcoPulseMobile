// useSingleYearPicker.js
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

export const useSingleYearPicker = ({
  initialYear = dayjs().year(),
  onYearChange
}) => {
  const [year, setYear] = useState(dayjs(initialYear?.toString()));
  const [error, setError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleYearChange = useCallback((newYear) => {
    const newValue = dayjs(newYear.toString());
    if (!newValue || !newValue.isValid()) {
      setError(true);
      return;
    }
    setError(false);
    setYear(newValue);
    onYearChange?.(newValue.year());
    setShowPicker(false);
  }, [onYearChange]);

  const handleReset = useCallback(() => {
    const currentYear = dayjs().year();
    const defaultYear = dayjs(currentYear.toString());
    
    setYear(defaultYear);
    onYearChange?.(defaultYear.year());
    setError(false);
  }, [onYearChange]);

  const togglePicker = useCallback(() => {
    setShowPicker(prev => !prev);
  }, []);

  return {
    year,
    error,
    showPicker,
    handleYearChange,
    handleReset,
    togglePicker
  };
};

export default useSingleYearPicker;