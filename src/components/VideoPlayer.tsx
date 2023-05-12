import { component$ } from "@builder.io/qwik";

type Props = {
 movieImage: string;
 movie: string;
};

const teckenSprakUrl = "https://teckensprakslexikon.su.se/";

export default component$(({ movieImage, movie }: Props) => {
 return (
  <video
   class="rounded-lg"
   poster={`${teckenSprakUrl}${movieImage}`}
   src={`${teckenSprakUrl}${movie}`}
   autoPlay
   width="560"
   muted
   loop
   controls
  />
 );
});
