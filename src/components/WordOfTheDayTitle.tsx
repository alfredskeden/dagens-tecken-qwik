import { component$ } from "@builder.io/qwik";
import type { SimilarData } from "@prisma/client";
import type { TSPQuizResponse } from "~/types/tspquiz";

type Props = {
 wordOfTheDay: SimilarData | TSPQuizResponse;
};

export default component$(({ wordOfTheDay }: Props) => {
 return (
  <h2 class="text-3xl">
   {wordOfTheDay.word.charAt(0).toUpperCase() + wordOfTheDay.word.slice(1)}
  </h2>
 );
});
