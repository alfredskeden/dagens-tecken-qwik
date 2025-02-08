import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { SimilarData } from "@prisma/client";
import dayjs from "dayjs";
import PreviousAndNextDayLinks from "~/components/PreviousAndNextDayLinks";
import VideoPlayer from "~/components/VideoPlayer";
import WordOfTheDayDescription from "~/components/WordOfTheDayDescription";
import WordOfTheDayTitle from "~/components/WordOfTheDayTitle";
import WordSelectionButtons from "~/components/WordSelectionButtons";
import type { TSPQuizResponse } from "~/types/tspquiz";
import { futureData } from "~/utils/futureData";
import { prisma } from "~/utils/prisma";

export const apiString = "https://tspquiz.se/api/";

const fetchWithRetry = async (url: string, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://tspquiz.se/",
          Origin: "https://tspquiz.se",
        },
      });

      // Log the raw response text
      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      // Parse the text to JSON after we've logged it
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error(`Failed to parse JSON: ${responseText.substring(0, 200)}...`);
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const useTodaysWord = routeLoader$(async (requestEvent) => {
  const dateCreated = `${requestEvent.params.day}/${requestEvent.params.month}/${requestEvent.params.year}`;
  if (dayjs(`${requestEvent.params.year}-${requestEvent.params.month}-${requestEvent.params.day}`).diff(dayjs()) > 0) {
    return [{ ...futureData }];
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
    try {
      const randomWord: TSPQuizResponse[] = await fetchWithRetry(`${apiString}?action=random&count=1`);

      if (!randomWord?.[0]?.movie_image) {
        console.error("Missing movie_image in API response");
        return [{ ...futureData }];
      }

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

      try {
        const similarWords: TSPQuizResponse[] = await fetchWithRetry(
          `${apiString}?action=all-by-word&word=${encodeURI(createdWord.word)}&flexible_match=1&max_count=30&excludeUncommon=0`
        );

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
      } catch (error) {
        console.error("Error fetching similar words:", error);
        return [{ ...futureData }];
      }
    } catch (error) {
      console.error("Error fetching random word:", error);
      return [{ ...futureData }];
    }
  }

  return word.similarDataId;
});

export default component$(() => {
  const wordOfTheDay = useTodaysWord();
  const selectedId = useSignal(0);
  const loc = useLocation();

  if (loc.isNavigating) selectedId.value = 0;

  if (wordOfTheDay.value.length <= 0)
    return (
      <h2 class="text-3xl">
        <Link class="underline hover:no-underline" href="/">
          Try again
        </Link>
      </h2>
    );

  return (
    <div class="flex flex-col gap-4 justify-center items-center px-4 md:p-0">
      <div class="flex flex-col gap-4 justify-center items-center px-4 md:p-0">
        <PreviousAndNextDayLinks />
        <WordOfTheDayTitle word={wordOfTheDay.value[selectedId.value].word} signId={wordOfTheDay.value[selectedId.value].signId} />
        <VideoPlayer movie={wordOfTheDay.value[selectedId.value].movie} movieImage={wordOfTheDay.value[selectedId.value].movie_image} />
        {wordOfTheDay.value.length > 1 && <WordSelectionButtons wordOfTheDay={wordOfTheDay.value} selectedId={selectedId} />}
        <WordOfTheDayDescription description={wordOfTheDay.value[selectedId.value].description} />
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const word = resolveValue(useTodaysWord);

  return {
    title: `Dagens Tecken "${word[0].word}"`,
    meta: [
      {
        name: "description",
        content: word[0].description,
      },
      {
        name: "id",
        content: word[0].id,
      },
    ],
  };
};
