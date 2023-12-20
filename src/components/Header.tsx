import { $, component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const search = useStore({
    term: "",
  });

  const nameStore = useStore({
    name: "",
    nameInStorage: "",
    initialCheck: false,
  });

  const nav = useNavigate();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    () => {
      const namedStorage = localStorage.getItem("name");
      nameStore.initialCheck = true;
      
      if (namedStorage) {
        nameStore.nameInStorage = namedStorage;
        return;
      }
    },
    { strategy: "document-ready" },
  );

  const setNamedStorage = $(() => {
    localStorage.setItem("name", nameStore.name);
    nameStore.nameInStorage = nameStore.name;
  });

  const clearNamedStorage = $(() => {
    localStorage.removeItem("name");
    nameStore.name = "";
    nameStore.nameInStorage = "";
  });

  return (
    <header class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 class="flex text-4xl font-bold align-middle mb-2 sm:mb-0">
          <Link href="/" class="text-white">
            Dagens tecken
          </Link>
        </h1>
        <div class="flex flex-col space-y-2">
          <div class="flex items-center mt-4 sm:mt-0">
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
          <div>
            {nameStore.initialCheck ? !nameStore.nameInStorage ? (
              <div>
                <input
                  value={nameStore.name}
                  onInput$={(ev) =>
                    (nameStore.name = (ev.target as HTMLInputElement).value)
                  }
                  onKeyPress$={(e) => {
                    if (e.key === "Enter") {
                      setNamedStorage();
                    }
                  }}
                  type="text"
                  class="bg-gray-700 text-white rounded-full py-2 px-4 focus:outline-none sm:mb-0"
                />
                <button
                  class="bg-gray-600 text-white rounded-full py-2 px-4 ml-2"
                  onClick$={setNamedStorage}
                >
                  Save
                </button>
              </div>
            ) : (
              <div class="flex space-x-2 justify-end">
                <span>{nameStore.nameInStorage}</span>
                <button class="text-red-500" onClick$={clearNamedStorage}>
                  X
                </button>
              </div>
            ) : (<span class="flex space-x-2 justify-end">loading...</span>)}
          </div>
        </div>
      </div>
    </header>
  );
});
