import { useState, useEffect } from 'react';

export const useCodeStatus = () => {
  const [codeStatus, setCodeStatus] = useState('Code Green');

  useEffect(() => {
    const savedStatus = localStorage.getItem('r-pager-code-status');
    if (savedStatus) {
      setCodeStatus(savedStatus);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('r-pager-code-status', codeStatus);
  }, [codeStatus]);

  return {
    codeStatus,
    setCodeStatus
  };
};