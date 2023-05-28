import { Resource, component$, useResource$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useNavigate } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';
import Loading from '~/components/Loading';
import VideoPlayer from '~/components/VideoPlayer';
import WordOfTheDayDescription from '~/components/WordOfTheDayDescription';
import WordOfTheDayTitle from '~/components/WordOfTheDayTitle';
import { apiString } from '~/routes';
import type { TSPQuizResponse } from '~/types/tspquiz';

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  const words = useResource$<TSPQuizResponse[]>(async ({ track }) => {
    track(() => loc.params.searchTerm);

    const res2 = await fetch(
      `${apiString}?action=all-by-word&word=${encodeURI(
        loc.params.searchTerm
      )}&flexible_match=1&max_count=10&excludeUncommon=1`
    );
    const words: TSPQuizResponse[] = await res2.json();
    if ((!words || !words.length) && loc.params.searchTerm) {
      nav(`/search-sentence/${loc.params.searchTerm}`);
      return [];
    }
    return words;
  });

  if (loc.isNavigating) {
    return <Loading />;
  }

  return (
    <Resource
      value={words}
      onPending={() => <Loading />}
      onResolved={(words) => {
        return (
          <div class="flex flex-col gap-10">
            {words.map((word) => {
              if (!word.movie) {
                return null;
              }
              return (
                <div key={word.id} class="flex flex-col items-center gap-4">
                  <WordOfTheDayTitle word={word.word} signId={word.id} />
                  <VideoPlayer movieImage={word.movie_image} movie={word.movie} />
                  <WordOfTheDayDescription description={word.description} />
                </div>
              );
            })}
            ;
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
