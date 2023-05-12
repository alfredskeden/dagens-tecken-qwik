import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { SimilarData } from "@prisma/client";
import PlayButton from "~/utils/icons/PlayButton";

type Props = {
 wordOfTheDay: SimilarData[];
 selectedId: Signal<number>;
};

export default component$(({ wordOfTheDay, selectedId }: Props) => {
 return (
  <div class="flex flex-wrap gap-4 justify-center">
   {wordOfTheDay.map((wordOfTD: SimilarData, index: number) => {
    return (
     <button
      class={` ${
       selectedId.value === index
        ? "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
        : "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      }`}
      key={wordOfTD.id}
      disabled={selectedId.value === index}
      onClick$={() => (selectedId.value = index)}
     >
      <div class="flex gap-2 items-center">
       {selectedId.value === index && <PlayButton />}
       <span class={`${selectedId.value === index ? "" : "ml-6"}`}>
        {wordOfTD.word}
       </span>
      </div>
     </button>
    );
   })}
  </div>
 );
});
