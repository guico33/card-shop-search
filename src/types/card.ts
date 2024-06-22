import { FieldValue, Timestamp } from '@firebase/firestore';

import { Website } from './shops';

export type CardData = {
  cardName: string;
  links: Record<Website, string>;
  checked: boolean;
  timestamp?: Timestamp | FieldValue;
};
