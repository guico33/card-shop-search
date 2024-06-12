import { get, set } from 'idb-keyval';
import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

const useIndexedDB = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Fetch the value from IndexedDB on mount
  useEffect(() => {
    get(key).then((value: T | undefined) => {
      if (value !== undefined) {
        setStoredValue(value);
      }
    });
  }, [key]);

  const debouncedValue = useDebounce(storedValue, 500);

  // Store the value in IndexedDB whenever it changes
  useEffect(() => {
    console.log('set', key, debouncedValue);
    set(key, debouncedValue);
  }, [key, debouncedValue]);

  return [storedValue, setStoredValue] as const;
};

export default useIndexedDB;
