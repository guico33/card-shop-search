import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    // Allow value to be a function so we have same API as useState
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
  };

  // debounce the saving to local storage
  const debouncedValue = useDebounce(storedValue, 1000);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(debouncedValue));
    } catch (error) {
      console.error(error);
    }
  }, [debouncedValue, key]);

  return [storedValue, setValue] as const;
};

export default useLocalStorage;
