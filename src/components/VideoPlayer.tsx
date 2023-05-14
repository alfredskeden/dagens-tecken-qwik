import type { QRL } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';

type Props = {
  movieImage: string;
  movie: string;
  controls?: boolean;
  loop?: boolean;
  onEnded?: QRL<() => void>;
};

export const teckenSprakUrl = 'https://teckensprakslexikon.su.se/';

export const VideoPlayerNL = ({
  movieImage,
  movie,
  loop = true,
  controls = true,
  onEnded,
}: Props) => {
  return (
    <video
      class="rounded-lg"
      poster={`${teckenSprakUrl}${movieImage}`}
      src={`${teckenSprakUrl}${movie}`}
      autoPlay
      width="560"
      muted
      loop={loop}
      controls={controls}
      onEnded$={() => {
        if (onEnded) {
          onEnded();
        }
      }}
    />
  );
};

export default component$(VideoPlayerNL);
