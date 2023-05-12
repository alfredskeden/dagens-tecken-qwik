import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { SimilarData } from "@prisma/client";

type Props = {
 wordOfTheDay: Readonly<Signal<SimilarData[]>>;
 selectedId: number;
};

const teckenSprakUrl = "https://teckensprakslexikon.su.se/";

export default component$(({ wordOfTheDay, selectedId }: Props) => {
 return (
  <video
   class="rounded-lg"
   poster={`${teckenSprakUrl}${wordOfTheDay.value[selectedId].movie_image}`}
   src={`${teckenSprakUrl}${wordOfTheDay.value[selectedId].movie}`}
   autoPlay
   width="560"
   muted
   loop
   controls
  />
 );
});
