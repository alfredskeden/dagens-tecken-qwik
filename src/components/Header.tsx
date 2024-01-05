import { component$, useContext, useSignal } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { LocalStorageNameContext } from "~/routes/layout";

export default component$(() => {
  const search = useSignal("");
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
        <div class="flex flex-col sm:flex-row space-x-2 mt-2 sm:mt-0 items-center">
          <div class="flex flex-row items-center">
            <input
              value={search.value}
              onInput$={(ev) =>
                (search.value = (ev.target as HTMLInputElement).value)
              }
              onKeyPress$={(e) => {
                if (e.key === "Enter") {
                  nav(`/search/${encodeURI(search.value)}`);
                }
              }}
              type="text"
              class="bg-gray-700 text-white rounded-full py-2 px-4 focus:outline-none sm:mb-0"
            />
            <button
              class="bg-gray-600 text-white rounded-full py-2 px-4 ml-2"
              onClick$={() => nav(`/search/${encodeURI(search.value)}`)}
            >
              Sök
            </button>
          </div>
          <div class="flex items-center mt-2 sm:mt-0">
            <Link
              class="bg-gray-600 text-white rounded-full py-2 px-4 text-center"
              href="/sign-in"
            >
              {!storedName.localStorageName.value ? "Logga in" : "Logga ut"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
});
