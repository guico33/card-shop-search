import { doc, getDoc, setDoc } from '@firebase/firestore';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { useUpdateLinksHistory } from '../../api/linksHistory';
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
  const [links, setLinks, loadingIndexedDB] = useIndexedDB<CardData[]>('cardLinks', []);
  const [linksFetched, setLinksFetched] = useState(false);
  const [fetchingLinks, setFetchingLinks] = useState(false);

  const { mutate: updateLinksHistory } = useUpdateLinksHistory(user?.uid);

  // Fetch the links from Firestore when the user logs in
  // after links have been fetched from IndexedDB
  useEffect(() => {
    if (user && !loadingIndexedDB && !linksFetched) {
      setFetchingLinks(true);

      const fetchData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const links = docSnap.data().links ?? [];
            setLinks(links);
          }
        } catch (error) {
          console.error('Error fetching links:', error);
        } finally {
          setLinksFetched(true);
          setFetchingLinks(false);
        }
      };

      fetchData();
    }
  }, [user, setLinks, loadingIndexedDB, linksFetched]);

  // Reset linksFetched when the user logs out
  useEffect(() => {
    if (!user && linksFetched) {
      setLinksFetched(false);
    }
  }, [user, linksFetched]);

  useEffect(() => {
    if (user && !loadingIndexedDB && linksFetched && links.length > 0) {
      const saveData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, { links }, { merge: true });
        } catch (error) {
          console.error('Error saving links:', error);
        }
      };

      saveData();
    }
  }, [links, linksFetched, loadingIndexedDB, user]);

  useEffect(() => {
    if (user && links.length > 0) {
      updateLinksHistory(links);
    }
  }, [links, linksFetched, updateLinksHistory, user]);

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
