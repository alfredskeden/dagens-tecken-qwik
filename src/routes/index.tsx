import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, server$, useLocation } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { SimilarData } from "@prisma/client";
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

const makeTheGuess = server$(
  async (
    guess: string,
    wordOfTheDay: string,
    wordOfTheDayId: string,
    name: string
  ) => {
    if (guess.toLowerCase() === wordOfTheDay.toLowerCase()) {
      return await prisma.guessWord.create({
        data: {
          solvedBy: name,
          wordOfTheDayId,
        },
      });
    }

    return "wrong";
  }
);

export const useTodaysWord = routeLoader$(async () => {
  const word = await prisma.wordOfTheDay.findFirst({
    where: {
      dateCreated: dayjs().format(dateFormat),
    },
    include: {
      similarDataId: true,
    },
  });

  if (!word) {
    const res1 = await fetch(
      `${apiString}?action=random&count=1&excludeUncommon=1`
    );
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

    const res2 = await fetch(
      `${apiString}?action=all-by-word&word=${encodeURI(
        createdWord.word
      )}&flexible_match=1&max_count=30&excludeUncommon=1`
    );
    const similarWords: TSPQuizResponse[] = await res2.json();

    const similarData: SimilarData[] = [];

    for (const words of similarWords) {
      if (words.word === createdWord.word) {
        const newSimilarWords = await prisma.similarData.create({
          data: {
            word: words.word,
            description: words.description,
            movie: words.movie,
            movie_image: words.movie_image,
            signId: words.id,
            wordOfTheDayId: createdWord.id,
          },
        });
        similarData.push(newSimilarWords);
      }
    }
    return similarData;
  }

  return word.similarDataId;
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

  if (wordOfTheDay.value.length <= 0) {
    return (
      <div class="flex justify-center h-screen mt-4">
        <h2 class="text-3xl">Try again</h2>
      </div>
    );
  }

  const userGuessesWord = $(async (wordGuesss: string) => {
    if (wordGuesss === "") return;
    const newGuesses = await makeTheGuess(
      wordGuesss,
      wordOfTheDay.value[0].word,
      wordOfTheDay.value[0].wordOfTheDayId,
      nameInStorage.localStorageName.value ?? ""
    );
    if (newGuesses === "wrong") {
      guessedWrong.value = true;
      userGuess.value = "";
      return;
    }

    return location.reload();
  });

  const isNameInGuessedArray = guessWord.value?.some((obj) =>
    Object.values(obj).some((value) =>
      String(value).includes(nameInStorage.localStorageName.value ?? "")
    )
  );

  const guessedTheWord =
    guessWord.value && guessWord.value.length > 0 && isNameInGuessedArray;

  if (!nameInStorage.initialLoad.value) return <></>;

  if (nameInStorage.localStorageName.value === null) {
    return (
      <div class="flex justify-center mt-4">
        <div class="flex flex-col">
          <PreviousAndNextDayLinks />
          <div class="flex flex-col mt-4 text-center">
            <span>"Logga in" för att kunna gissa</span>
            <div class="flex justify-center">
              <Link
                class="bg-gray-600 text-white rounded-full py-2 px-4 block"
                href="/sign-in"
              >
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
        <WordOfTheDayTitle
          word={wordOfTheDay.value[selectedId.value].word}
          signId={wordOfTheDay.value[selectedId.value].signId}
        />
      )}
      <VideoPlayer
        movieImage={wordOfTheDay.value[selectedId.value].movie_image}
        movie={wordOfTheDay.value[selectedId.value].movie}
      />
      {guessedTheWord && wordOfTheDay.value.length > 1 && (
        <WordSelectionButtons
          wordOfTheDay={wordOfTheDay.value}
          selectedId={selectedId}
        />
      )}
      {guessedTheWord && (
        <WordOfTheDayDescription
          description={wordOfTheDay.value[selectedId.value].description}
        />
      )}
      {(guessWord.value !== undefined && guessWord.value.length === 0) ||
        (!isNameInGuessedArray && (
          <div class="flex flex-col">
            <div class="flex items-center">
              <input
                value={userGuess.value}
                onInput$={(ev) =>
                  (userGuess.value = (ev.target as HTMLInputElement).value)
                }
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    userGuessesWord((e.target as HTMLInputElement).value);
                  }
                }}
                type="text"
                class="bg-gray-700 text-white rounded-full py-2 px-4 focus:outline-none sm:mb-0"
              />
              <button
                class="bg-gray-600 text-white rounded-full py-2 px-4 ml-2"
                onClick$={() => userGuessesWord(userGuess.value)}
              >
                Gissa
              </button>
            </div>
            {guessedWrong.value && (
              <div class="flex items-center">
                <span class="text-red-700">Fel gissat</span>
              </div>
            )}
          </div>
        ))}
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
