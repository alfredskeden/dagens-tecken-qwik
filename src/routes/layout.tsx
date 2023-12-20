import type { Signal } from '@builder.io/qwik';
import { component$, createContextId, Slot, useContextProvider, useSignal } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import { useLocalStorage } from '~/hooks/useLocalStorage';

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const LocalStorageNameContext = createContextId<Signal<string>>('localeStorageName');
export const nameSignalContext = createContextId<Signal<string>>('nameSignalName');

export default component$(() => {
  const testSingaL = useSignal('');
  useContextProvider(LocalStorageNameContext, useLocalStorage(testSingaL, 'name'));
  useContextProvider(nameSignalContext, testSingaL);

  return (
    <>
      <Header />
      <main class="px-4 md:px-0">
        <Slot />
      </main>
      <Footer />
    </>
  );
});
