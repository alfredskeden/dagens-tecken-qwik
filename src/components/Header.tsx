import { component$, useContext, useStore } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { LocalStorageNameContext } from "~/routes/layout";

export default component$(() => {
  const search = useStore({
    term: "",
  });
  const storedName = useContext(LocalStorageNameContext);

  const nav = useNavigate();

  return (
    <header class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 class="flex text-4xl font-bold align-middle mb-2 sm:mb-0">
          <Link href="/" class="text-white">
            Dagens tecken
          </Link>
        </h1>
        <div class="flex space-x-2 mt-2 sm:mt-0">
          <div class="flex items-center">
            <input
              value={search.term}
              onInput$={(ev) =>
                (search.term = (ev.target as HTMLInputElement).value)
              }
              onKeyPress$={(e) => {
                if (e.key === "Enter") {
                  nav(`/search/${encodeURI(search.term)}`);
                }
              }}
              type="text"
              class="bg-gray-700 text-white rounded-full py-2 px-4 focus:outline-none sm:mb-0"
            />
            <button
              class="bg-gray-600 text-white rounded-full py-2 px-4 ml-2"
              onClick$={() => nav(`/search/${encodeURI(search.term)}`)}
            >
              Sök
            </button>
          </div>
          <div class="flex items-center">
            <Link
              class="bg-gray-600 text-white rounded-full py-2 px-4"
              href="/sign-in"
            >
              {!storedName.value ? "Sign in" : "Sign out"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
});
