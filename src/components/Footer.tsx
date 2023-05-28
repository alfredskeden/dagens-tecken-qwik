import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <footer class="flex mt-auto min-h-[40px] justify-center border border-t-2">
      <div class="flex gap-1 p-4">
        <span>UMAIN</span> -{' '}
        <Link class="hover:underline" href="https://github.com/alfredskeden/dagens-tecken-qwik">
          alfredskeden
        </Link>{' '}
        -{' '}
        <span>
          Videos av{' '}
          <Link class="hover:underline" href="https://teckensprakslexikon.su.se/">
            teckenspråkslexikon
          </Link>
        </span>
      </div>
    </footer>
  );
});
