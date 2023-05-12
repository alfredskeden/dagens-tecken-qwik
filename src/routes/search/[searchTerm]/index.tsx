import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import VideoPlayer from "~/components/VideoPlayer";
import WordOfTheDayTitle from "~/components/WordOfTheDayTitle";
import { apiString } from "~/routes";
import type { TSPQuizResponse } from "~/types/tspquiz";

export const useFetchWords = routeLoader$(async (requestEvent) => {
 const res2 = await fetch(
  `${apiString}?action=all-by-word&word=${encodeURI(
   requestEvent.params.searchTerm
  )}&flexible_match=1&max_count=30&excludeUncommon=0`
 );
 const words: TSPQuizResponse[] = await res2.json();
 return words;
});

export default component$(() => {
 const words = useFetchWords();

 return (
  <div class="flex flex-col">
   {words.value.map((word) => {
    return (
     <div key={word.id} class="flex flex-col items-center">
      <WordOfTheDayTitle wordOfTheDay={word} />
      <VideoPlayer wordOfTheDay={word} />
     </div>
    );
   })}
  </div>
 );
});
