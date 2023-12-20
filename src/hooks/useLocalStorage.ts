import type { Signal } from '@builder.io/qwik';
import { useSignal, useVisibleTask$ } from '@builder.io/qwik';

export function useLocalStorage(signal: Signal, storeName: string) {
  const nameStore = useSignal<string | null>('');

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => signal.value);
    nameStore.value = localStorage.getItem(storeName);
  });

  return nameStore;
}
