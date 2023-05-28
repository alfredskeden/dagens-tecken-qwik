import { Resource, component$, $, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import Loading from '~/components/Loading';
import { VideoPlayerNL } from '~/components/VideoPlayer';
import WordOfTheDayTitle from '~/components/WordOfTheDayTitle';
import { apiString } from '~/routes';
import type { TSPQuizResponse } from '~/types/tspquiz';

export const useSentenceBuilder = routeLoader$(async ({ params }) => {
  const searchString = decodeURI(params.searchTerm);

  const splitSearchTerm = searchString.split(' ');

  const sentenceArray: TSPQuizResponse[] = [];

  for (const searchWords of splitSearchTerm) {
    const res2 = await fetch(
      `${apiString}?action=all-by-word&word=${encodeURI(
        searchWords
      )}&flexible_match=0&max_count=1&excludeUncommon=0`
    );
    const words: TSPQuizResponse[] = await res2.json();

    if (words.length > 0) {
      sentenceArray.push(words[0]);
    }
  }

  return sentenceArray;
});

export default component$(() => {
  const currentPlayingId = useSignal(0);
  const sentence = useSentenceBuilder();

  const movieEnded = $(() => {
    currentPlayingId.value++;
  });

  const resetSelectedId = $(() => {
    currentPlayingId.value = 0;
  });

  return (
    <Resource
      value={sentence}
      onPending={() => <Loading />}
      onResolved={(sentenceWords) => {
        if (!sentenceWords || !sentenceWords.length) {
          return (
            <div class="flex justify-center h-screen mt-4">
              <h2 class="text-4xl">Hittade inga tecken. Försök igen</h2>
            </div>
          );
        }

        return (
          <div class="flex flex-col items-center gap-10">
            <div class="flex flex-row gap-1">
              {sentenceWords.map((sentenceWord, index) => {
                if (!sentenceWord.movie) {
                  return null;
                }
                return (
                  <WordOfTheDayTitle
                    key={`${sentenceWord.id}-${index}`}
                    word={sentenceWord.word}
                    signId={sentenceWord.id}
                    underline={index === currentPlayingId.value}
                  />
                );
              })}
            </div>
            <VideoPlayerNL
              movieImage={sentenceWords[currentPlayingId.value].movie_image}
              movie={sentenceWords[currentPlayingId.value].movie}
              loop={false}
              controls={false}
              onEnded={
                currentPlayingId.value + 1 != sentenceWords.length ? movieEnded : resetSelectedId
              }
            />
          </div>
        );
      }}
    />
  );
});

export const head: DocumentHead = ({ params }) => {
  return {
    title: `Dagens Tecken - Sökning - ${params.searchTerm}`,
  };
};
