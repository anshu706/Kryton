'use client';

import type { InfoCard } from '@/types';
import { WikipediaCardView } from './WikipediaCardView';
import { NewspaperCardView } from './NewspaperCardView';
import { LetterCardView } from './LetterCardView';
import { ImageCardView } from './ImageCardView';
import { VideoCardView } from './VideoCardView';
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
    case 'wikipedia':
      return <WikipediaCardView card={card} isFloating={isFloating} />;
    case 'newspaper':
      return <NewspaperCardView card={card} isFloating={isFloating} />;
    case 'letter':
      return <LetterCardView card={card} isFloating={isFloating} />;
    case 'image':
      return <ImageCardView card={card} isFloating={isFloating} />;
    case 'video':
      return <VideoCardView card={card} isFloating={isFloating} />;
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
