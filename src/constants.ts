import { Website } from './types';

export const websites = [
  'Hareruya',
  'TokyoMTG',
  'OneMTG',
  'Flagship Games',
  'Hideout',
  'Mox & Lotus',
  'Agora Hobby',
  'Grey Ogre',
] as const;

export const websiteToUrl: Record<Website, string> = {
  Hareruya: 'https://www.hareruyamtg.com/en/products/search',
  TokyoMTG: 'https://tokyomtg.com/cardpage.html',
  OneMTG: 'https://www.onemtg.com.sg/search',
  'Flagship Games': 'https://www.flagshipgames.sg/search',
  Hideout: 'https://www.hideout-online.com/search',
  'Mox & Lotus': 'https://moxandlotus.sg/products',
  'Agora Hobby': 'https://agorahobby.com/store/search',
  'Grey Ogre': 'https://www.greyogregames.com/search',
};
