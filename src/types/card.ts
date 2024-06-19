import { Website } from './shops';

export type CardData = {
  cardName: string;
  links: Record<Website, string>;
  checked: boolean;
};
