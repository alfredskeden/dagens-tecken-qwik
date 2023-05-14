import type { QwikIntrinsicElements, Signal } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';
import type { SimilarData } from '@prisma/client';

export function MaterialSymbolsPlayCircleOutlineRounded(
  props: QwikIntrinsicElements['svg'],
  key: string
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      key={key}
    >
      <path
        fill="currentColor"
        d="m10.65 15.75l4.875-3.125q.35-.225.35-.625t-.35-.625L10.65 8.25q-.375-.25-.763-.038t-.387.663v6.25q0 .45.388.663t.762-.038ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"
      ></path>
    </svg>
  );
}

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
                ? 'bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed'
                : 'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
            }`}
            key={wordOfTD.id}
            disabled={selectedId.value === index}
            onClick$={() => (selectedId.value = index)}
          >
            <div class="flex gap-2 items-center">
              {selectedId.value === index && <MaterialSymbolsPlayCircleOutlineRounded />}
              <span class={`${selectedId.value === index ? '' : 'ml-6'}`}>{wordOfTD.word}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
});
