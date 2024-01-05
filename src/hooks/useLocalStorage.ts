import type { Signal } from "@builder.io/qwik";
import { useSignal, useVisibleTask$ } from "@builder.io/qwik";

export function useLocalStorage(signal: Signal, storeName: string) {
  const localStorageName = useSignal<string | null>(null);
  const initialLoad = useSignal<boolean>(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => signal.value);
    localStorageName.value = localStorage.getItem(storeName);
    initialLoad.value = true;
  });

  return { initialLoad, localStorageName };
}
