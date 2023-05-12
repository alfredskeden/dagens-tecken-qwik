import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
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

export const dateFormat = "DD/MM/YYYY";
export const apiString = "https://tspquiz.se/api/";

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
  const res1 = await fetch(`${apiString}?action=random&count=1`);
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
   )}&flexible_match=1&max_count=30&excludeUncommon=0`
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
 const selectedId = useSignal(0);

 if (wordOfTheDay.value.length <= 0) return <h2 class="text-3xl">Try again</h2>;

 return (
  <div class="flex flex-col justify-center items-center gap-4 px-4 md:p-0">
   <PreviousAndNextDayLinks />
   <WordOfTheDayTitle wordOfTheDay={wordOfTheDay.value[selectedId.value]} />
   <VideoPlayer wordOfTheDay={wordOfTheDay.value[selectedId.value]} />
   {wordOfTheDay.value.length > 1 && (
    <WordSelectionButtons wordOfTheDay={wordOfTheDay} selectedId={selectedId} />
   )}
   <WordOfTheDayDescription
    wordOfTheDay={wordOfTheDay}
    selectedId={selectedId.value}
   />
  </div>
 );
});

export const head: DocumentHead = {
 title: "Dagens Tecken",
 meta: [
  {
   name: "description",
   content: "Dagens teckenspråk tecken",
  },
 ],
};
