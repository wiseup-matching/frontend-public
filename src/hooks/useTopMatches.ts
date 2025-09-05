import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import useSWR from 'swr';
import { defaultApi } from '@/api/defaultapi.ts';
import { useJobPostingMatches } from '@/hooks/useMatches';
import { useRetiree } from '@/hooks/useRetiree';
import { getRandomDummyImage } from '@/components/custom/profileBlurringUtils';
import type { Match } from '@/api/openapi-client';

/** Centralises "top matches" logic plus carousel state. */
const useTopMatches = (jobPostingId?: string) => {
  /* ----------- Fetch & slice top matches ----------- */
  const {
    matches: allMatches,
    loading: matchesLoading,
    error: matchesError,
  } = useJobPostingMatches(jobPostingId);

  const [topMatches, setTopMatches] = useState<Match[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  /** Remember the last “acceptable match” ids so we don’t jump back to index 0 if nothing changed */
  const prevIdsRef = useRef<string[]>([]);

  // grab best‑scored – but only reset the carousel if the *set* of ids really changed
  useEffect(() => {
    if (!allMatches.length) {
      setTopMatches([]);
      return;
    }
    const ACCEPTABLE_SCORE_THRESHOLD = 0.33; // minimum score to be considered a good match
    const filteredMatches = allMatches.filter(
      (m) => m.score && m.score >= ACCEPTABLE_SCORE_THRESHOLD,
    );
    const sorted = [...filteredMatches].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    const newIds = sorted.map((m) => m.id);
    const idsChanged =
      newIds.length !== prevIdsRef.current.length ||
      newIds.some((id, i) => id !== prevIdsRef.current[i]);

    setTopMatches(sorted);

    if (idsChanged) {
      setCurrentMatchIndex(0);
      prevIdsRef.current = newIds;
    }
  }, [allMatches]);

  /* ----------- Track current retiree ----------- */
  const currentRetireeId = topMatches[currentMatchIndex]?.retiree ?? '';
  const { retiree } = useRetiree(currentRetireeId);

  /* ----------- Prepare image map ----------- */
  const [imageMap, setImageMap] = useState<Record<string, { url: string; blurred: boolean }>>({});

  const prepareImages = useCallback(
    (matchesArr: Match[], prev: Record<string, { url: string; blurred: boolean }>) => {
      const newMap = { ...prev };

      matchesArr.forEach((m) => {
        const id = m.retiree ?? '';
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (newMap[id]) return;

        // We do not access the profile picture directly from the match
        // Instead, initialize with a blurred dummy image and let the retiree data update it later
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!prev[id]) {
          const pic = getRandomDummyImage();
          newMap[id] = { url: pic, blurred: true };
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          const pic = prev[id].url ?? getRandomDummyImage();
          newMap[id] = { url: pic, blurred: true };
        }
      });

      return newMap;
    },
    [],
  );

  useEffect(() => {
    if (allMatches.length) {
      setImageMap((prev) => prepareImages(allMatches, prev));
    }
  }, [allMatches, prepareImages]);

  /* ----------- Bulk‑fetch retiree visibility flags ----------- */
  const retireeIds = useMemo(
    () => topMatches.map((m) => m.retiree).filter(Boolean) as string[],
    [topMatches],
  );

  const { data: retireesBulk } = useSWR(
    retireeIds.length ? ['/retiree-bulk', retireeIds] : null,
    () => Promise.all(retireeIds.map((id) => defaultApi.retireeRetireeIdGet({ retireeId: id }))),
    { revalidateOnFocus: false },
  );

  // un‑blur every retiree whose profile is no longer obscured
  useEffect(() => {
    if (!retireesBulk) return;
    setImageMap((prev) => {
      const next = { ...prev };
      retireesBulk.forEach((retiree) => {
        if (retiree.isObscured === false) {
          next[retiree.id] = {
            url: retiree.profilePicture ?? '',
            blurred: false,
          };
        }
      });
      return next;
    });
  }, [retireesBulk]);

  // reveal clear photo when retiree un-obscures profile
  useEffect(() => {
    if (retiree && retiree.isObscured === false) {
      setImageMap((prev) => ({
        ...prev,
        [retiree.id]: {
          url: retiree.profilePicture ?? '',
          blurred: false,
        },
      }));
    }
  }, [retiree]);

  /* ----------- Navigation helpers ----------- */
  const nextMatch = () => {
    if (topMatches.length) {
      setCurrentMatchIndex((i) => (i + 1) % topMatches.length);
    }
  };

  const prevMatch = () => {
    if (topMatches.length) {
      setCurrentMatchIndex((i) => (i === 0 ? topMatches.length - 1 : i - 1));
    }
  };

  const selectMatch = (index: number) => {
    if (topMatches.length && index >= 0 && index < topMatches.length) {
      setCurrentMatchIndex(index);
    }
  };
  // keep `currentMatch` in sync
  useEffect(() => {
    if (topMatches.length > 0 && currentMatchIndex >= 0 && currentMatchIndex < topMatches.length) {
      setCurrentMatch(topMatches[currentMatchIndex]);
    } else {
      setCurrentMatch(null);
    }
  }, [topMatches, currentMatchIndex]);

  const retireeMap = useMemo(() => {
    if (!retireesBulk) return {};
    return retireesBulk.reduce<Record<string, { nameFirst?: string }>>((acc, retiree) => {
      acc[retiree.id] = { nameFirst: retiree.nameFirst };
      return acc;
    }, {});
  }, [retireesBulk]);

  return {
    topMatches,
    currentMatch: currentMatch ?? null, // null if no matches
    currentRetiree: retiree,
    currentMatchIndex,
    imageMap,
    retireeMap,
    matchesLoading,
    matchesError,
    nextMatch,
    prevMatch,
    selectMatch,
  };
};

export default useTopMatches;
