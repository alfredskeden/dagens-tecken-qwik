import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { SimilarData } from "@prisma/client";

type Props = {
 wordOfTheDay: Readonly<Signal<SimilarData[]>>;
 selectedId: number;
};

export default component$(({ wordOfTheDay, selectedId }: Props) => {
 return (
  <p class="max-w-[560px]">{wordOfTheDay.value[selectedId].description}</p>
 );
});
