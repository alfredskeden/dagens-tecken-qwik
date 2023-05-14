import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import VideoPlayer from '~/components/VideoPlayer';
import WordOfTheDayDescription from '~/components/WordOfTheDayDescription';
import WordOfTheDayTitle from '~/components/WordOfTheDayTitle';
import { apiString } from '~/routes';
import type { TSPQuizResponse } from '~/types/tspquiz';

export const useWordId = routeLoader$(async ({ params }) => {
  const res = await fetch(`${apiString}?action=words&ids=${encodeURI(`["${params.id}"]`)}`);

  const word: TSPQuizResponse[] = await res.json();
  return word[0];
});

export default component$(() => {
  const word = useWordId();

  return (
    <div class="mt-4">
      <div class="flex flex-col gap-4 px-4 md:p-0 mx-auto max-w-[560px] items-center">
        <WordOfTheDayTitle word={word.value.word} />
        <VideoPlayer movieImage={word.value.movie_image} movie={word.value.movie} />
        <WordOfTheDayDescription description={word.value.description} />
        {word.value.phrases.length > 0 && (
          <div class="flex flex-col gap-4 self-start w-full">
            <h2 class="text-2xl self-center underline">Fraser</h2>
            <div class="flex flex-col gap-4">
              {word.value.phrases.map((phrase) => {
                return (
                  <details
                    key={phrase.phrase}
                    class="question py-4 border-b border-grey-lighter hover:cursor-pointer"
                  >
                    <summary class="flex items-center text-xl mb-4">{phrase.phrase}</summary>
                    <VideoPlayer movieImage={phrase.movie_image} movie={phrase.movie} />
                  </details>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ params }) => {
  return {
    title: `Dagens Tecken - Id - ${params.id}`,
  };
};
