import { component$ } from "@builder.io/qwik";

type Props = {
 word: string;
};

export default component$(({ word }: Props) => {
 return (
  <h2 class="text-3xl">{word.charAt(0).toUpperCase() + word.slice(1)}</h2>
 );
});
