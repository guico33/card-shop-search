import { useEffect, useState } from 'react';
import { websiteToUrl, websites } from './constants';
import { Website } from './types';
import { useMediaQuery, useTheme } from '@mui/material';

const cardNameParsingRegex = /(\d)*x*(\s)*(?<cardName>.+)/;

export const generateLinks = (
  cardList: string,
): {
  cardName: string;
  links: Record<Website, string>;
}[] => {
  const cardListArray = cardList.split('\n').filter((card) => card.trim() !== '');

  return cardListArray.map((card) => {
    // get what's after the first space
    let cardName = card.match(cardNameParsingRegex)?.groups?.cardName.trim() ?? '';
    // get what's before the first (character)
    cardName = cardName.split('(')[0].trim();
    return {
      cardName,
      links: Object.fromEntries(
        websites.map((website) => {
          let params: URLSearchParams = new URLSearchParams();
          if (website === 'Hareruya') {
            params = new URLSearchParams({
              suggest_type: 'all',
              product: cardName.split('//')[0].replaceAll(' ', '+'),
              stock: '1',
              order: 'ASC',
              sort: 'price',
            });
          } else if (website === 'TokyoMTG') {
            params = new URLSearchParams({
              p: 'a',
              query: cardName.replaceAll(' ', '+'),
              acm: '0',
              ass: '0',
              ast: '0',
              asx: '0',
              asa: '0',
            });
          } else if (website === 'Mox & Lotus') {
            params = new URLSearchParams({
              title: cardName.replaceAll(' ', '+'),
            });
          } else if (website === 'Agora Hobby') {
            params = new URLSearchParams({
              category: 'mtg',
              searchfield: cardName.replaceAll(' ', '+'),
            });
          } else {
            params = new URLSearchParams({
              q: cardName.replaceAll(' ', '+'),
            });
          }

          const url = `${websiteToUrl[website]}?${params.toString().replaceAll('%2B', '+')}`;

          return [website, url];
        }),
      ) as Record<Website, string>,
    };
  });
};

// https://usehooks.com/useDebounce/
export const useDebounce = <T>(value: T, delay: number) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
};

export const useBreakpoints = () => {
  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlDown = useMediaQuery(theme.breakpoints.down('xl'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

  return {
    isMd,
    isSm,
    isXs,
    isLg,
    isXl,
    isSmDown,
    isSmUp,
    isMdDown,
    isMdUp,
    isLgDown,
    isLgUp,
    isXlDown,
    isXlUp,
    breakpoints: theme.breakpoints.values,
  };
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
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
    // persist to local storage
    try {
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
