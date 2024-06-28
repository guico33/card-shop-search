import { useContext } from 'react';

import { CardsContext } from './CardsProvider';

export const useCardsContext = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error('useCardsContext must be used within a CardsProvider');
  }
  return context;
};
