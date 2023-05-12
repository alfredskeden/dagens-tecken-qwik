import { component$, useStore } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
 const search = useStore({
  term: "",
 });

 const nav = useNavigate();

 return (
  <header class="bg-gray-800 text-white">
   <div class="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
    <h1 class="flex text-4xl font-bold align-middle mb-2 sm:mb-0">
     <Link href="/" class="text-white">
      Dagens Tecken!
     </Link>
    </h1>
    <div class="flex items-center mt-4 sm:mt-0">
     <input
      value={search.term}
      onInput$={(ev) => (search.term = (ev.target as HTMLInputElement).value)}
      onKeyPress$={(e) => {
       if (e.key === "Enter") {
        nav(`/search/${encodeURI(search.term)}`);
       }
      }}
      type="text"
      placeholder="Search"
      class="bg-gray-700 text-white rounded-full py-2 px-4 focus:outline-none sm:mb-0"
     />
     <button
      class="bg-gray-600 text-white rounded-full py-2 px-4 ml-2"
      onClick$={() => nav(`/search/${encodeURI(search.term)}`)}
     >
      Search
     </button>
    </div>
   </div>
  </header>
 );
});
