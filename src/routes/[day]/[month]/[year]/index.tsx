import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { SimilarData } from '@prisma/client';
import dayjs from 'dayjs';
import type { TSPQuizResponse } from '~/types/tspquiz';
import PlayButton from '~/utils/icons/PlayButton';
import { prisma } from '~/utils/prisma';

const dateFormat = 'DD/MM/YYYY';
const apiString = 'https://tspquiz.se/api/';

export const useTodaysWord = routeLoader$(async (requestEvent) => {
  const dateCreated = `${requestEvent.params.day}/${requestEvent.params.month}/${requestEvent.params.year}`;
  if (dayjs(`${requestEvent.params.year}-${requestEvent.params.month}-${requestEvent.params.day}`).diff(dayjs()) > 0) {
    return [];
  }

  const word = await prisma.wordOfTheDay.findFirst({
    where: {
      dateCreated,
    },
    include: {
      similarDataId: true,
    },
  });

  if (!word) {
    const res1 = await fetch(`${apiString}?action=random&count=1`);
    const randomWord: TSPQuizResponse[] = await res1.json();

    const { id, word, description, movie, movie_image } = randomWord[0];

    const createdWord = await prisma.wordOfTheDay.create({
      data: {
        dateCreated,
        word,
        description,
        movie,
        movie_image,
        signId: id,
      },
    });

    const res2 = await fetch(`${apiString}?action=all-by-word&word=${encodeURI(createdWord.word)}&flexible_match=1&max_count=30&excludeUncommon=0`);
    const similarWords: TSPQuizResponse[] = await res2.json();

    const similarData: SimilarData[] = [];

    for (const words of similarWords) {
      if (words.word === createdWord.word) {
        const newSimilarWords = await prisma.similarData.create({
          data: {
            word: words.word,
            description: words.description,
            movie: words.movie,
            movie_image: words.movie_image,
            signId: words.id,
            wordOfTheDayId: createdWord.id,
          },
        });
        similarData.push(newSimilarWords);
      }
    }
    return similarData;
  }

  return word.similarDataId;
});

export default component$(() => {
  const wordOfTheDay = useTodaysWord();
  const selectedId = useSignal(0);
  const loc = useLocation();

  const currentDay = `${loc.params.year}-${loc.params.month}-${loc.params.day}`;

  if (wordOfTheDay.value.length <= 0)
    return (
      <h2 class="text-3xl">
        <Link class="underline hover:no-underline" href="/">
          Try again
        </Link>
      </h2>
    );

  return (
    <div class="flex flex-col justify-center items-center gap-4 px-4 md:p-0">
      <div class="flex items-center gap-10 mt-2">
        <div class="flex">
          <Link class="underline" href={`/${dayjs(currentDay).subtract(1, 'day').format(dateFormat)}`}>
            Föregående dag ({dayjs(currentDay).subtract(1, 'day').format('DD/MM-YY')})
          </Link>
        </div>
        {dayjs(currentDay).add(1, 'day').diff(dayjs()) > 0 ? (
          <span>Nästa dag ({dayjs(currentDay).add(1, 'day').format('DD/MM-YY')})</span>
        ) : (
          <Link class="underline" href={`/${dayjs(currentDay).add(1, 'day').format(dateFormat)}`}>
            Nästa dag ({dayjs(currentDay).add(1, 'day').format('DD/MM-YY')})
          </Link>
        )}
      </div>
      <h2 class="text-3xl">{wordOfTheDay.value[selectedId.value].word.charAt(0).toUpperCase() + wordOfTheDay.value[selectedId.value].word.slice(1)}</h2>
      <video
        class="rounded-lg"
        poster={`https://teckensprakslexikon.su.se/${wordOfTheDay.value[selectedId.value].movie_image}`}
        src={`https://teckensprakslexikon.su.se/${wordOfTheDay.value[selectedId.value].movie}`}
        autoPlay
        width="560"
        muted
        loop
        controls
      />
      {wordOfTheDay.value.length > 1 && (
        <div class="flex flex-wrap gap-4 justify-center">
          {wordOfTheDay.value.map((wordOfTD: SimilarData, index: number) => {
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
                  {selectedId.value === index && <PlayButton />}
                  <span class={`${selectedId.value === index ? '' : 'ml-6'}`}>{wordOfTD.word}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <p class="max-w-[560px]">{wordOfTheDay.value[selectedId.value].description}</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Dagens Tecken',
  meta: [
    {
      name: 'description',
      content: 'Dagens teckenspråk tecken',
    },
  ],
};
