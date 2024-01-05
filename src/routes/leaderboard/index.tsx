import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { prisma } from "~/utils/prisma";

export const useGuessedWords = routeLoader$(async () => {
  const guesses = await prisma.guessWord.findMany({
    select: {
      solvedBy: true,
    },
  });

  const counts: { [name: string]: number } = {};

  guesses.forEach((guess) => {
    const { solvedBy } = guess;
    counts[solvedBy] = (counts[solvedBy] || 0) + 1;
  });

  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
});

export default component$(() => {
  const allGuessedWords = useGuessedWords();

  console.log(allGuessedWords.value);

  return (
    <div class="flex flex-col items-center mt-4 space-y-5">
      <h2 class="text-4xl">Leaderboard</h2>
      <ol>
        {allGuessedWords.value.map(([name, count]) => {
          return (
            <li class="list-none" key={`${name}-${count}`}>
              <div class="flex flex-row justify-between space-x-8">
                <span>{name}:</span>
                <span>{count}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
});
