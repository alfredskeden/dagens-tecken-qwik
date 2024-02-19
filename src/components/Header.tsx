import { component$, useContext, useSignal } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { LocalStorageNameContext } from "~/routes/layout";

export default component$(() => {
  const search = useSignal("");
  const storedName = useContext(LocalStorageNameContext);

  const nav = useNavigate();

  return (
    <header>
      <div class="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 class="flex text-4xl font-bold align-middle mb-2 sm:mb-0">
          <Link href="/" class="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-green-300 to-yellow-400">
            Dagens tecken
          </Link>
        </h1>
        <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-y-0 gap-x-0 sm:gap-x-12 mt-2 sm:mt-0 items-center">
          <Link class="rounded-full hover:underline" href={`/search/${encodeURI("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z Å Ä Ö")}`}>
            Alfabetet
          </Link>
          <div class="flex flex-row items-center space-x-6">
            <input
              value={search.value}
              onInput$={(ev) => (search.value = (ev.target as HTMLInputElement).value)}
              onKeyPress$={(e) => {
                if (e.key === "Enter" && search.value !== "") {
                  nav(`/search/${encodeURI(search.value)}`);
                }
              }}
              type="text"
              class="rounded-full focus:outline-none sm:mb-0 text-black"
            />
            <button
              class="rounded-full hover:underline"
              onClick$={() => {
                if (search.value === "") return;
                nav(`/search/${encodeURI(search.value)}`);
              }}
            >
              Sök
            </button>
          </div>
          <Link class="rounded-full hover:underline" href="/sign-in">
            {!storedName.localStorageName.value ? "Logga in" : "Logga ut"}
          </Link>
        </div>
      </div>
    </header>
  );
});
