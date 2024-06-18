import { createContext, useCallback, useMemo } from 'react';
import useIndexedDB from '../../hooks/useIndexedDB';
import { CardData } from '../../types';
import { getLinksList } from '../../utils';

type LinksContextType = {
  links: CardData[];
  removeCard: (cardName: string) => void;
  toggleCheckCard: (cardName: string) => void;
  toggleCheckAllCards: () => void;
  generateLinks: (cardsList: string) => void;
  clearLinks: () => void;
  isAllCardsChecked: boolean;
  isSomeCardsChecked: boolean;
  isNoCardsChecked: boolean;
};

export const LinksContext = createContext<LinksContextType | undefined>(undefined);

type LinksProviderProps = {
  children: React.ReactNode;
};

const LinksProvider = ({ children }: LinksProviderProps) => {
  const [links, setLinks] = useIndexedDB<CardData[]>('cardLinks', []);

  const removeCard = useCallback(
    (cardName: string) => {
      setLinks((prevLinks) => {
        const updatedLinks = prevLinks.filter((link) => link.cardName !== cardName);
        return updatedLinks;
      });
    },
    [setLinks],
  );

  const toggleCheckCard = useCallback(
    (cardName: string) => {
      setLinks((prevLinks) => {
        const updatedLinks = prevLinks.map((link) => {
          if (link.cardName === cardName) {
            return { ...link, checked: !link.checked };
          }
          return link;
        });
        return updatedLinks;
      });
    },
    [setLinks],
  );

  const checkAllCards = useCallback(() => {
    setLinks((prevLinks) => {
      const updatedLinks = prevLinks.map((link) => {
        return { ...link, checked: true };
      });
      return updatedLinks;
    });
  }, [setLinks]);

  const uncheckAllCards = useCallback(() => {
    setLinks((prevLinks) => {
      const updatedLinks = prevLinks.map((link) => {
        return { ...link, checked: false };
      });
      return updatedLinks;
    });
  }, [setLinks]);

  const generateLinks = useCallback(
    (cardsList: string) => {
      setLinks((prevLinks) => {
        const updatedLinks = getLinksList(cardsList.trim(), prevLinks);
        return updatedLinks;
      });
    },
    [setLinks],
  );

  const clearLinks = useCallback(() => {
    setLinks([]);
  }, [setLinks]);

  const nbCardsChecked = useMemo(() => links.filter((link) => link.checked).length, [links]);

  const isAllCardsChecked = nbCardsChecked === links.length && links.length > 0;

  const isSomeCardsChecked = nbCardsChecked > 0 && !isAllCardsChecked;

  const isNoCardsChecked = !isSomeCardsChecked && !isAllCardsChecked;

  const toggleCheckAllCards = useCallback(() => {
    if (isAllCardsChecked) {
      uncheckAllCards();
    } else {
      checkAllCards();
    }
  }, [checkAllCards, isAllCardsChecked, uncheckAllCards]);

  return (
    <LinksContext.Provider
      value={{
        links,
        removeCard,
        toggleCheckCard,
        toggleCheckAllCards,
        generateLinks,
        clearLinks,
        isAllCardsChecked,
        isSomeCardsChecked,
        isNoCardsChecked,
      }}
    >
      {children}
    </LinksContext.Provider>
  );
};

export default LinksProvider;
