import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import { LocalStorageNameContext, nameSignalContext } from "../layout";

export default component$(() => {
  const inputValue = useSignal("");

  const nameInStorage = useContext(LocalStorageNameContext);
  const currentName = useContext(nameSignalContext);

  const setNamedStorage = $(() => {
    if (!inputValue.value) return;
    localStorage.setItem("name", inputValue.value);
    currentName.value = inputValue.value;
  });

  const clearNamedStorage = $(() => {
    localStorage.removeItem("name");
    currentName.value = "";
    inputValue.value = "";
    nameInStorage.localStorageName.value = "";
  });

  if (!nameInStorage.initialLoad.value) return <></>;

  return (
    <div class="flex justify-center mt-4">
      {!nameInStorage.localStorageName.value ? (
        <div class="flex gap-x-8">
          <input
            value={inputValue.value}
            onInput$={(ev) => (inputValue.value = (ev.target as HTMLInputElement).value)}
            onKeyPress$={(e) => {
              if (e.key === "Enter") {
                setNamedStorage();
              }
            }}
            type="text"
            class="text-black rounded-full py-2 px-4 focus:outline sm:mb-0"
          />
          <button class="rounded-full hover:underline" onClick$={setNamedStorage}>
            Save
          </button>
        </div>
      ) : (
        <div class="flex gap-8">
          <span class="inline-block align-baseline text-3xl">{nameInStorage.localStorageName.value}</span>
          <button class="rounded-full hover:underline" onClick$={clearNamedStorage}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
});
