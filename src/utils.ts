import { websites, websiteToUrl } from './constants/stores';
import { CardData } from './types/card';
import { Website } from './types/shops';

const cardNameParsingRegex = /(\d)*x*(\s)*(?<cardName>.+)/;

export const getLinksList = (cardList: string, existingLinks: CardData[]): CardData[] => {
  const cardListArray = cardList.split('\n').filter((card) => card.trim() !== '');

  return cardListArray.map((card) => {
    // get what's after the first space
    let cardName = card.match(cardNameParsingRegex)?.groups?.cardName.trim() ?? '';
    // get what's before the first (character)
    cardName = cardName.split('(')[0].trim();
    return {
      cardName,
      // if the card already exists in the links, keep the checked status
      checked: existingLinks.find((link) => link.cardName === cardName)?.checked ?? false,
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
              title: cardName.split('//')[0].replaceAll(' ', '+'),
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
