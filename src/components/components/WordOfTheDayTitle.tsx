import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { SimilarData } from "@prisma/client";

type Props = {
 wordOfTheDay: Readonly<Signal<SimilarData[]>>;
 selectedId: number;
};

export default component$(({ wordOfTheDay, selectedId }: Props) => {
 return (
  <h2 class="text-3xl">
   {wordOfTheDay.value[selectedId].word.charAt(0).toUpperCase() +
    wordOfTheDay.value[selectedId].word.slice(1)}
  </h2>
 );
});
