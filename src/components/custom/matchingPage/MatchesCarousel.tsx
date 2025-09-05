import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlurClass } from '@/components/custom/profileBlurringUtils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Match } from '@/api/openapi-client';

const SIZE_ACTIVE = 128; // w-32 h-32
const SIZE_SIDE = 96; // w-24 h-24
const SIZE_FAR = 80; // w-20 h-20

const GAP_PX = 16;

interface ImageMapEntry {
  url: string;
  blurred: boolean;
}
type ImageMap = Record<string, ImageMapEntry | undefined>;

interface MatchesCarouselProps {
  matches: Match[];
  currentIndex: number;
  imageMap: ImageMap;
  retireeMap: Record<string, { nameFirst?: string } | undefined>;
  loading: boolean;
  error: unknown;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  score?: number | null;
}

const MatchesCarousel: React.FC<MatchesCarouselProps> = ({
  matches,
  currentIndex,
  imageMap,
  retireeMap,
  loading,
  error,
  onPrev,
  onNext,
  onSelect,
  score,
}) => {
  /* ---------- Guard states ---------- */
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        {/* skeletons live in parent for brevity */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-red-500">Error loading matches</div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div>
      {' '}
      {/* Increased from mb-8 to mb-12 */}
      <div className="relative">
        <div className="text-center">
          {matches.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Candidate {currentIndex + 1} of {matches.length}
            </p>
          )}
        </div>
        <div className="relative flex items-center justify-center">
          {matches.length > 1 && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 z-20 h-12 w-12 rounded-full"
              onClick={onPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {/* avatars */}
          <div className="flex items-center justify-center h-fit min-h-[128px]">
            <div className="relative flex items-center justify-center h-40">
              {matches.map((match: Match, index) => {
                /* ------------- positioning math ------------- */
                const position = index - currentIndex;
                const retireeId = match.retiree ?? '';

                const isActive = position === 0;
                const isSide = Math.abs(position) === 1;
                const isHidden = Math.abs(position) > 2;

                const baseDiameter = isActive ? SIZE_ACTIVE : isSide ? SIZE_SIDE : SIZE_FAR;

                const scale = isActive ? 1 : isSide ? 0.9 : 0.8;

                const renderedDiameter = baseDiameter * scale;

                const offsetPx = position * (SIZE_ACTIVE / 2 + renderedDiameter / 2 + GAP_PX);

                const offsetPxStr = `${String(offsetPx)}px`;
                const scaleStr = String(scale);

                /* ------------- visual state ------------- */

                const matchScore = match.score ?? score ?? 0;
                const scorePercentage = Math.round(matchScore * 100);

                const baseClass =
                  'absolute overflow-hidden transition-transform transition-opacity duration-500 ease-out cursor-pointer select-none';

                const sizeClass = isActive ? 'w-32 h-32' : isSide ? 'w-24 h-24' : 'w-20 h-20';

                const opacity = isHidden ? 0 : isActive ? 1 : isSide ? 0.75 : 0.4;

                const imgData = imageMap[retireeId] ?? { url: '', blurred: true };

                const blurClass = getBlurClass(imgData.blurred);

                const retiree = retireeMap[retireeId];
                const retireeNameFirst = retiree?.nameFirst;

                return (
                  <div
                    key={match.id}
                    style={{
                      transform: `translateX(${offsetPxStr}) scale(${scaleStr})`,
                      opacity,
                      zIndex: isActive ? 30 : isSide ? 20 : 10,
                    }}
                    className={`${baseClass} ${sizeClass}`}
                    onClick={() => onSelect(index)}
                  >
                    {/* Circular progress indicator */}
                    <div className="relative w-full h-full">
                      {/* Background circle */}
                      <div className="absolute inset-0 rounded-full var(--background)"></div>

                      {/* Dark blue progress circle - starting from top clockwise */}
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        {(() => {
                          const scoreDegrees = scorePercentage * 3.6;
                          return (
                            <div
                              className="w-full h-full"
                              style={{
                                background: `conic-gradient(from 0deg, var(--primary) 0deg, var(--accent) ${String(scoreDegrees)}deg, transparent ${String(scoreDegrees)}deg)`,
                              }}
                            />
                          );
                        })()}
                      </div>

                      {/* Single white circle behind all images with consistent spacing */}
                      <div className="absolute inset-1 rounded-full bg-white"></div>

                      {/* Center hole for the image */}
                      <div className="absolute inset-2 rounded-full overflow-hidden">
                        <Avatar className="w-full h-full">
                          <AvatarImage
                            src={imgData.url !== '' ? imgData.url : undefined}
                            alt={retireeNameFirst ?? 'Candidate profile'}
                            className={`object-cover w-full h-full ${blurClass}`}
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground font-medium text-2xl">
                            {retireeNameFirst ? retireeNameFirst.charAt(0).toUpperCase() : '?'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {matches.length > 1 && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 z-20 h-12 w-12 rounded-full"
              onClick={onNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesCarousel;
