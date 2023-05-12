import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <header class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 class="text-4xl font-bold mb-4">
          <Link href="/" class="text-white">
            Dagens Tecken!
          </Link>
        </h1>
        <div class="flex items-center">
          <input type="text" placeholder="Search" class="bg-gray-700 text-white rounded-full py-2 px-4 focus:outline-none" />
          <button class="bg-gray-600 text-white rounded-full py-2 px-4 ml-2">Search</button>
        </div>
      </div>
    </header>
  );
});
