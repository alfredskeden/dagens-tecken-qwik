import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="flex justify-center h-screen mt-4">
      <div class="flex flex-col animate-pulse">
        <div class="w-64 h-14 bg-gray-300 rounded"></div>
        <div class="w-[560px] h-[400px] bg-gray-300 rounded mt-2"></div>
        <div class="w-64 h-4 bg-gray-300 rounded mt-2"></div>
      </div>
    </div>
  );
});
