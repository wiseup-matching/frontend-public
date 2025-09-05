import { pseudoRandomNumBySeed } from '@/lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import React from 'react';
import { ChevronRight, MapPinIcon } from 'lucide-react';

interface BrowseResultsItemCardProps {
  key: React.Key;
  title: string;
  nameFirst: string;
  secondaryTitle: React.ReactNode;
  imageUrl: string;
  imageFallbackInitialsText?: string;
  location: string;
  chips: ChipProps[];
  href: string;
  className?: string;
}

export default function BrowseResultsItemCard({
  key,
  title,
  nameFirst,
  secondaryTitle,
  imageUrl,
  imageFallbackInitialsText,
  location,
  chips,
  href,
  className,
}: BrowseResultsItemCardProps) {
  const isDummyImage = imageUrl.startsWith('/obscure-profilepics/ObscureDummyImage');
  const pseudoRandomContrast = 50 + pseudoRandomNumBySeed(href + 'a') * 100; // 50 to 150%
  const pseudoRandomSaturation = 50 + pseudoRandomNumBySeed(href + 'b') * 100; // 50 to 150%
  const pseudoRandomSepia = pseudoRandomNumBySeed(href + 'c') * 100; // 0 to 100%
  const pseudoRandomBrightness = 75 + pseudoRandomNumBySeed(href + 'd') * 50; // 75 to 125%
  const pseudoRandomHue = -30 + pseudoRandomNumBySeed(href + 'e') * 60; // -30 to 30 degrees
  const inlineStyleString = isDummyImage
    ? ' contrast(' +
      pseudoRandomContrast.toString() +
      '%) saturate(' +
      pseudoRandomSaturation.toString() +
      '%) sepia(' +
      pseudoRandomSepia.toString() +
      '%) brightness(' +
      pseudoRandomBrightness.toString() +
      '%) hue-rotate(' +
      pseudoRandomHue.toString() +
      'deg)'
    : undefined;

  imageFallbackInitialsText ??= nameFirst;

  return (
    <div
      className={
        'w-full bg-white rounded-lg shadow-sm border border-gray-100 flex sm:items-center py-4 px-2 ' +
        (className ?? '')
      }
      key={key}
    >
      {/* Left side with image */}
      <div className={'p-4' + (isDummyImage ? ' blur-sm' : '')}>
        <div className="relative w-12 h-12 rounded-md">
          <Avatar className="w-12 h-12 rounded-md relative overflow-hidden">
            <AvatarImage
              src={imageUrl}
              alt={title}
              className="object-cover w-12 h-12 overflow-visible"
              style={isDummyImage ? { filter: inlineStyleString } : undefined}
              draggable={false}
            />
            {!isDummyImage && (
              <AvatarFallback className="bg-muted rounded-md text-muted-foreground font-medium text-xl">
                {imageFallbackInitialsText
                  ? imageFallbackInitialsText.charAt(0).toUpperCase()
                  : '?'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>

      {/* Middle content */}
      <div className="flex-1 p-2">
        <div className="grid sm:grid-cols-4 gap-2 items-start grid-cols-1">
          <h3 className="font-bold text-xl text-gray-900 sm:col-span-2">{title}</h3>
          <p className="text-gray-500">{secondaryTitle}</p>

          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span className="text-gray-700">{location}</span>
          </div>
        </div>

        {/* Chips row */}
        <div className="flex flex-wrap gap-2 mt-3">
          {chips.map((chip) => (
            <Chip key={chip.hoverCardHint} chip={chip} />
          ))}
        </div>
      </div>

      {/* Right arrow */}
      <div className="w-10 h-10 flex items-center justify-center text-primary">
        <ChevronRight className="h-10 w-10" />
      </div>
    </div>
  );
}

interface ChipProps {
  title: string | string[];
  hoverCardHint?: string;
}

function Chip({ chip }: { chip: ChipProps }) {
  const { title, hoverCardHint } = chip;

  const displayTitle = Array.isArray(title)
    ? title[0] + (title.length > 1 ? `, +${(title.length - 1).toString()}` : '')
    : title;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className={`px-4 py-2 bg-background rounded-full text-sm text-gray-700`}>
          {' '}
          {displayTitle}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="bg-white shadow-lg rounded-lg p-4 w-48 z-1">
        <div className="text-gray-800">
          {hoverCardHint && <div className="text-xs text-gray-500 mb-2">{hoverCardHint}</div>}
          {Array.isArray(title) ? (
            title.map((item) => <div key={item}>{item}</div>)
          ) : (
            <span>{title}</span>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
