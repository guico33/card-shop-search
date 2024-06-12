import { websites } from './constants';

export type Website = (typeof websites)[number];

export type CardData = {
  cardName: string;
  links: Record<Website, string>;
  checked: boolean;
};
