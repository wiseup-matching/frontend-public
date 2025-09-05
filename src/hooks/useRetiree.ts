import useSWR, { type KeyedMutator } from 'swr';
import { defaultApi } from '../api/defaultapi.ts';
import type { Retiree } from '@/api/openapi-client/models/Retiree';
// one tiny fetcher so SWR knows how to load the data
const fetchRetiree = (id: string) => defaultApi.retireeRetireeIdGet({ retireeId: id });

export function useRetiree(id?: string) {
  const key = id ? (['/retiree', id] as const) : null;

  const swrResponse: {
    data: Retiree | undefined;
    error: unknown;
    isLoading: boolean;
    mutate: KeyedMutator<Retiree>;
  } = useSWR<Retiree>(
    key,
    () => {
      if (!id) throw new Error('Retiree ID is required');
      return fetchRetiree(id);
    },
    {
      revalidateOnFocus: false,
    },
  );

  const { data, error, isLoading, mutate } = swrResponse;

  // Force revalidate from the server (if you need it somewhere else)
  const refreshRetiree = () => mutate();

  return {
    retiree: data,
    loading: isLoading,
    error,
    refreshRetiree,
    mutateRetiree: mutate,
  };
}

const fetchRetirees = () => defaultApi.retireeGet();

export function useRetirees() {
  const swrResponse: {
    data: Retiree[] | undefined;
    error: unknown;
    isLoading: boolean;
    mutate: KeyedMutator<Retiree[]>;
  } = useSWR<Retiree[]>('/retirees', fetchRetirees, {
    revalidateOnFocus: false,
  });

  const { data, error, isLoading, mutate } = swrResponse;
  return {
    retirees: data ?? [],
    loading: isLoading,
    error,
    refreshRetirees: mutate,
    mutateRetirees: mutate,
  };
}
