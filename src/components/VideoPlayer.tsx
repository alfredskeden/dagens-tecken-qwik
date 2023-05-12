import { component$ } from "@builder.io/qwik";
import type { SimilarData } from "@prisma/client";
import type { TSPQuizResponse } from "~/types/tspquiz";

type Props = {
 wordOfTheDay: SimilarData | TSPQuizResponse;
};

const teckenSprakUrl = "https://teckensprakslexikon.su.se/";

export default component$(({ wordOfTheDay }: Props) => {
 return (
  <video
   class="rounded-lg"
   poster={`${teckenSprakUrl}${wordOfTheDay.movie_image}`}
   src={`${teckenSprakUrl}${wordOfTheDay.movie}`}
   autoPlay
   width="560"
   muted
   loop
   controls
  />
 );
});
