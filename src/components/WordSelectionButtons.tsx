import type { Signal } from "@builder.io/qwik";
import { component$, $ } from "@builder.io/qwik";
import type { SimilarData } from "@prisma/client";
import { MaterialSymbolsPlayCircleOutlineRounded } from "~/utils/icons";

type Props = {
  wordOfTheDay: SimilarData[];
  selectedId: Signal<number>;
};

export default component$(({ wordOfTheDay, selectedId }: Props) => {
  const isItemSelected = (index: number) => selectedId.value === index;
  const handleItemClick = $((index: number) => {
    selectedId.value = index;
  });

  return (
    <div class="flex flex-wrap gap-4 justify-center">
      {wordOfTheDay.map((wordOfTD: SimilarData, index: number) => (
        <button
          class={`${
            isItemSelected(index)
              ? "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
              : "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          }`}
          key={wordOfTD.id}
          disabled={isItemSelected(index)}
          onClick$={() => handleItemClick(index)}
        >
          <div class="flex gap-2 items-center">
            {isItemSelected(index) && (
              <MaterialSymbolsPlayCircleOutlineRounded />
            )}
            <span class={`${isItemSelected(index) ? "" : "ml-6"}`}>
              {wordOfTD.word}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
});
