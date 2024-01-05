import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <footer class="flex mt-auto bg-gray-200 justify-center">
      <div class="flex flex-col md:flex-row items-center md:justify-center p-4 gap-4">
        <Link
          href="https://umain.com/"
          class="text-gray-800 font-semibold hover:text-purple-600"
        >
          UMAIN
        </Link>
        <div class="flex items-center space-x-1">
          <span class="text-gray-800">av</span>
          <Link
            href="https://github.com/alfredskeden/dagens-tecken-qwik"
            class="text-gray-800 font-semibold hover:text-purple-600"
          >
            alfredskeden
          </Link>
        </div>
        <span class="text-gray-800">
          Videos från{" "}
          <Link
            href="https://teckensprakslexikon.su.se/"
            class="text-blue-500 hover:text-blue-700"
          >
            teckenspråkslexikon
          </Link>
        </span>
        <Link
          href="/leaderboard"
          class="text-gray-800 font-semibold hover:text-purple-600"
        >
          Leaderboard
        </Link>
      </div>
    </footer>
  );
});
