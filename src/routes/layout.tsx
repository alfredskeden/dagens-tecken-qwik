import type { Signal } from "@builder.io/qwik";
import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import dayjs from "dayjs";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { prisma } from "~/utils/prisma";

export const dateFormat = "DD/MM/YYYY";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const useGuessedWords = routeLoader$(async () => {
  const word = await prisma.wordOfTheDay.findFirst({
    where: {
      dateCreated: dayjs().format(dateFormat),
    },
    include: {
      guessWord: true,
    },
  });

  return word?.guessWord;
});

export const LocalStorageNameContext = createContextId<{
  initialLoad: Signal<boolean>;
  localStorageName: Signal<string | null>;
}>("localeStorageName");
export const nameSignalContext =
  createContextId<Signal<string>>("nameSignalName");

export default component$(() => {
  const testSignal = useSignal("");
  useContextProvider(
    LocalStorageNameContext,
    useLocalStorage(testSignal, "name")
  );
  useContextProvider(nameSignalContext, testSignal);

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
