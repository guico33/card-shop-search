import { useContext } from 'react';
import { LinksContext } from './LinksProvider';

export const useLinksContext = () => {
  const context = useContext(LinksContext);
  if (!context) {
    throw new Error('useLinks must be used within a LinksProvider');
  }
  return context;
};
