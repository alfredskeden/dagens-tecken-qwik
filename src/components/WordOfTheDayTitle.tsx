import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

type Props = {
  word: string;
  signId?: string;
  underline?: boolean;
};

export default component$(({ word, signId, underline = false }: Props) => {
  return (
    <h2 class={`text-3xl ${underline ? 'underline' : ''}`}>
      {signId ? (
        <Link href={`/id/${signId}`} class="hover:underline">
          {word.charAt(0).toUpperCase() + word.slice(1)}
        </Link>
      ) : (
        word.charAt(0).toUpperCase() + word.slice(1)
      )}
    </h2>
  );
});
