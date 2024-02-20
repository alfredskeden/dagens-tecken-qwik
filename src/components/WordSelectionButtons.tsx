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
    <div class="grid grid-cols-4 items-center gap-7 mb-8 mt-4">
      {wordOfTheDay.map((wordOfTD: SimilarData, index: number) => (
        <button
          class={`${
            isItemSelected(index)
              ? "bg-gray-600 text-white rounded-full py-2 px-4 block md:col-span-1 sm:col-span-2 col-span-4 opacity-50 cursor-not-allowed"
              : "bg-gray-600 text-white rounded-full py-2 px-4 block md:col-span-1 sm:col-span-2 col-span-4 hover:underline hover:border-white border border-transparent"
          }`}
          key={wordOfTD.id}
          disabled={isItemSelected(index)}
          onClick$={() => handleItemClick(index)}
        >
          <div class="flex gap-2 items-center">
            {isItemSelected(index) && <MaterialSymbolsPlayCircleOutlineRounded />}
            <span class={`${isItemSelected(index) ? "" : "ml-6"}`}>{wordOfTD.word}</span>
          </div>
        </button>
      ))}
    </div>
  );
});
