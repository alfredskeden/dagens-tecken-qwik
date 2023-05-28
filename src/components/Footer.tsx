import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <footer class="flex mt-auto min-h-[40px] md:justify-center border border-t-2">
      <div class="flex flex-col md:flex-row gap-4 p-4">
        <Link href="https://umain.com/">UMAIN</Link>
        <Link class="hover:underline" href="https://github.com/alfredskeden/dagens-tecken-qwik">
          alfredskeden
        </Link>
        <span>
          Videos från{' '}
          <Link class="hover:underline" href="https://teckensprakslexikon.su.se/">
            teckenspråkslexikon
          </Link>
        </span>
      </div>
    </footer>
  );
});
