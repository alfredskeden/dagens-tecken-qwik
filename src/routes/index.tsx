import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, server$, useLocation, routeLoader$ } from "@builder.io/qwik-city";
import dayjs from "dayjs";
import PreviousAndNextDayLinks from "~/components/PreviousAndNextDayLinks";
import VideoPlayer from "~/components/VideoPlayer";
import WordOfTheDayDescription from "~/components/WordOfTheDayDescription";
import WordOfTheDayTitle from "~/components/WordOfTheDayTitle";
import WordSelectionButtons from "~/components/WordSelectionButtons";
import type { TSPQuizResponse } from "~/types/tspquiz";
import { prisma } from "~/utils/prisma";
import { LocalStorageNameContext, dateFormat, useGuessedWords } from "./layout";

export const apiString = "https://tspquiz.se/api/";

const makeTheGuess = server$(async (guess: string, wordOfTheDay: string, wordOfTheDayId: string, name: string) => {
  if (guess.toLowerCase() === wordOfTheDay.toLowerCase()) {
    return await prisma.guessWord.create({
      data: {
        solvedBy: name,
        wordOfTheDayId,
      },
    });
  }

  return "wrong";
});

export const useTodaysWord = routeLoader$(async () => {
  const word = await prisma.wordOfTheDay.findFirst({
    where: {
      dateCreated: dayjs().format(dateFormat),
    },
    include: {
      similarDataId: true,
      wordsToCompare: true,
    },
  });

  if (!word) {
    const res1 = await fetch(`${apiString}?action=random&count=1&excludeUncommon=1`);
    const randomWord: TSPQuizResponse[] = await res1.json();

    const { id, word, description, movie, movie_image } = randomWord[0];

    const createdWord = await prisma.wordOfTheDay.create({
      data: {
        dateCreated: dayjs().format(dateFormat),
        word,
        description,
        movie,
        movie_image,
        signId: id,
      },
    });

    const res2 = await fetch(`${apiString}?action=all-by-word&word=${encodeURI(createdWord.word)}&flexible_match=1&max_count=30&excludeUncommon=1`);
    const similarWords: TSPQuizResponse[] = await res2.json();

    for (const words of similarWords) {
      if (words.word === createdWord.word) {
        await prisma.similarData.create({
          data: {
            word: words.word,
            description: words.description,
            movie: words.movie,
            movie_image: words.movie_image,
            signId: words.id,
            wordOfTheDayId: createdWord.id,
          },
        });
      }
    }

    const res3 = await fetch(`${apiString}?action=random&count=3&excludeUncommon=1`);
    const randomWordsToGuess: TSPQuizResponse[] = await res3.json();

    for (const words of randomWordsToGuess) {
      await prisma.wordsToCompare.create({
        data: {
          word: words.word,
          signId: words.id,
          wordOfTheDayId: createdWord.id,
        },
      });
    }

    const newWord = await prisma.wordOfTheDay.findFirst({
      where: {
        dateCreated: dayjs().format(dateFormat),
      },
      include: {
        similarDataId: true,
        wordsToCompare: true,
      },
    });

    return funcWordsToCompare(newWord);
  }

  return funcWordsToCompare(word);
});

const funcWordsToCompare = server$((wordOfTheDay) => {
  const wordsToCompare: string[] = wordOfTheDay.wordsToCompare.map((wordToCompare: any) => {
    return wordToCompare.word;
  });

  wordsToCompare.splice(((wordsToCompare.length + 1) * Math.random()) | 0, 0, wordOfTheDay.word);

  return { ...wordOfTheDay, wordsToCompare };
});

export default component$(() => {
  const wordOfTheDay = useTodaysWord();
  const guessWord = useGuessedWords();
  const selectedId = useSignal(0);
  const loc = useLocation();
  const userGuess = useSignal("");
  const guessedWrong = useSignal(false);
  const nameInStorage = useContext(LocalStorageNameContext);

  if (loc.isNavigating) selectedId.value = 0;

  if (!wordOfTheDay.value) {
    return (
      <div class="flex justify-center h-screen mt-4">
        <h2 class="text-3xl">Try again</h2>
      </div>
    );
  }

  const userGuessesWord = $(async (wordGuesss: string) => {
    if (wordGuesss === "") return;
    const newGuesses = await makeTheGuess(wordGuesss, wordOfTheDay.value.word, wordOfTheDay.value.id, nameInStorage.localStorageName.value ?? "");
    if (newGuesses === "wrong") {
      guessedWrong.value = true;
      userGuess.value = "";
      return;
    }

    return location.reload();
  });

  const isNameInGuessedArray = guessWord.value?.some((obj: any) =>
    Object.values(obj).some((value) => String(value).includes(nameInStorage.localStorageName.value ?? ""))
  );

  const guessedTheWord = guessWord.value && guessWord.value.length > 0 && isNameInGuessedArray;

  if (!nameInStorage.initialLoad.value) return <></>;

  if (nameInStorage.localStorageName.value === null) {
    return (
      <div class="flex justify-center mt-4">
        <div class="flex flex-col">
          <PreviousAndNextDayLinks />
          <div class="flex flex-col mt-4 text-center">
            <span>"Logga in" för att kunna gissa</span>
            <div class="flex justify-center">
              <Link class="bg-gray-600 text-white rounded-full py-2 px-4 block" href="/sign-in">
                Logga in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="flex flex-col justify-center items-center gap-4 px-4 md:p-0">
      <PreviousAndNextDayLinks />
      {guessedTheWord && (
        <WordOfTheDayTitle word={wordOfTheDay.value.similarDataId[selectedId.value].word} signId={wordOfTheDay.value.similarDataId[selectedId.value].signId} />
      )}
      <VideoPlayer
        movieImage={wordOfTheDay.value.similarDataId[selectedId.value].movie_image}
        movie={wordOfTheDay.value.similarDataId[selectedId.value].movie}
      />
      {guessedTheWord && wordOfTheDay.value.similarDataId.length > 1 && (
        <WordSelectionButtons wordOfTheDay={wordOfTheDay.value.similarDataId} selectedId={selectedId} />
      )}
      {guessedTheWord && <WordOfTheDayDescription description={wordOfTheDay.value.similarDataId[selectedId.value].description} />}
      {!isNameInGuessedArray && (
        <div class="flex flex-col gap-2">
          <div class="grid grid-cols-4 items-center gap-7 mb-8 mt-4">
            {wordOfTheDay.value.wordsToCompare.map((wordToCompare: string) => {
              return (
                <button
                  key={wordToCompare}
                  value={wordToCompare}
                  onClick$={() => userGuessesWord(wordToCompare)}
                  class="bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 text-white rounded-full py-2 px-4 block md:col-span-1 sm:col-span-2 col-span-4"
                >
                  {wordToCompare}
                </button>
              );
            })}
          </div>
          {guessedWrong.value && (
            <div class="flex text-center">
              <span class="text-red-700 font-bold">Fel gissat</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = () => {
  return {
    title: `Dagens Tecken`,
    meta: [
      {
        name: "description",
        content: "Gissa Dagens tecken!",
      },
    ],
  };
};
