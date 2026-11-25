import { useCallback, useEffect, useState } from 'react';

function readStoredValue(key, initialValue) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? initialValue : JSON.parse(storedValue);
  } catch (error) {
    console.error(`Could not read local storage key "${key}".`, error);
    return initialValue;
  }
}

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => readStoredValue(key, initialValue));

  const setStoredState = useCallback((value) => {
    setState((currentState) => (
      typeof value === 'function' ? value(currentState) : value
    ));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Could not save local storage key "${key}".`, error);
    }
  }, [key, state]);

  return [state, setStoredState];
}

export default useLocalStorageState;
