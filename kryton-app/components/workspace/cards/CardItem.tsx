'use client';

import type { InfoCard } from '@/types';
import { SourceCardView } from './SourceCardView';
import { AcademicCardView } from './AcademicCardView';
import { StatCardView } from './StatCardView';
import { FactCardView } from './FactCardView';
import { RelatedCardView } from './RelatedCardView';

interface Props {
  card: InfoCard;
  isFloating?: boolean;
}

export function CardItem({ card, isFloating }: Props) {
  switch (card.type) {
    case 'source':
      return <SourceCardView card={card} isFloating={isFloating} />;
    case 'academic':
      return <AcademicCardView card={card} isFloating={isFloating} />;
    case 'stat':
      return <StatCardView card={card} isFloating={isFloating} />;
    case 'fact':
      return <FactCardView card={card} isFloating={isFloating} />;
    case 'related':
      return <RelatedCardView card={card} isFloating={isFloating} />;
    default:
      return null;
  }
}
