import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <footer class="flex mt-auto justify-center border-t md:border-t-0 border-gray-300 border-opacity-35">
      <div class="flex flex-col md:flex-row items-center md:justify-center p-4 gap-x-12 gap-y-4">
        <Link href="https://umain.com/" class="font-semibold hover:underline">
          UMAIN
        </Link>
        <div class="flex items-center space-x-1">
          <span class="text-gray-800">av</span>
          <Link href="https://github.com/alfredskeden/dagens-tecken-qwik" class=" font-semibold hover:underline">
            alfredskeden
          </Link>
        </div>
        <span>
          Videos från{" "}
          <Link href="https://teckensprakslexikon.su.se/" class="text-blue-400 hover:text-blue-200 hover:underline">
            teckenspråkslexikon
          </Link>
        </span>
        <Link href="/leaderboard" class=" font-semibold hover:underline">
          Leaderboard
        </Link>
      </div>
    </footer>
  );
});
