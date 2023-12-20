import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { LocalStorageNameContext, nameSignalContext } from '../layout';

export default component$(() => {
  const inputValue = useSignal('');

  const nameInStorage = useContext(LocalStorageNameContext);
  const currentName = useContext(nameSignalContext);

  // eslint-disable-next-line qwik/no-use-visible-task

  const setNamedStorage = $(() => {
    if (!inputValue.value) return;
    localStorage.setItem('name', inputValue.value);
    currentName.value = inputValue.value;
  });

  const clearNamedStorage = $(() => {
    localStorage.removeItem('name');
    currentName.value = '';
    inputValue.value = '';
  });

  return (
    <div>
      {!nameInStorage.value ? (
        <div>
          <input
            value={inputValue.value}
            onInput$={(ev) => (inputValue.value = (ev.target as HTMLInputElement).value)}
            onKeyPress$={(e) => {
              if (e.key === 'Enter') {
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
          <span class="underline">{nameInStorage.value}</span>
          <button class="text-red-500" onClick$={clearNamedStorage}>
            X
          </button>
        </div>
      )}
    </div>
  );
});
