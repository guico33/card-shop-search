import { doc, getDoc, setDoc } from '@firebase/firestore';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { db } from '../../firebaseConfig';
import useIndexedDB from '../../hooks/useIndexedDB';
import { CardData } from '../../types/card';
import { getLinksList } from '../../utils';
import useAuthContext from '../AuthContext/useAuthContext';

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
  fetchingLinks: boolean;
};

export const LinksContext = createContext<LinksContextType | undefined>(undefined);

type LinksProviderProps = {
  children: React.ReactNode;
};

const LinksProvider = ({ children }: LinksProviderProps) => {
  const { user } = useAuthContext();
  const [links, setLinks, loading] = useIndexedDB<CardData[]>('cardLinks', []);
  const [linksFetched, setLinksFetched] = useState(false);
  const [fetchingLinks, setFetchingLinks] = useState(false);

  // Fetch the links from Firestore when the user logs in
  // after links have been fetched from IndexedDB
  useEffect(() => {
    if (user && !loading && !linksFetched) {
      setFetchingLinks(true);

      const fetchData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const links = docSnap.data().links;
          setLinks(links);
        }
      };

      fetchData()
        .catch((error) => {
          console.error('Error fetching links:', error);
        })
        .finally(() => {
          setLinksFetched(true);
          setFetchingLinks(false);
        });
    }
  }, [user, setLinks, loading, linksFetched]);

  // Reset linksFetched when the user logs out
  useEffect(() => {
    if (!user && linksFetched) {
      setLinksFetched(false);
    }
  }, [user, linksFetched]);

  // Save the links to Firestore when the user logs in
  useEffect(() => {
    if (user && !loading && linksFetched && !links.length) {
      const saveData = async () => {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { links });
      };

      saveData().catch((error) => {
        console.error('Error saving links:', error);
      });
    }
  }, [links, linksFetched, loading, user]);

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
        fetchingLinks,
      }}
    >
      {children}
    </LinksContext.Provider>
  );
};

export default LinksProvider;
