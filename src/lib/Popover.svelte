<script lang="ts">
  export let msg: string;

  let visible = false;
  const makeHandle = (value: boolean) => {
    return (event: Event): void => {
      visible = value;
    };
  };
</script>

<div class="block relative">
  <button
    class="bg-transparent outline-none border-none p-0 m-0"
    on:mouseover={makeHandle(true)}
    on:mouseout={makeHandle(false)}
    on:focus={makeHandle(true)}
    on:blur={makeHandle(false)}
    tabindex="-1"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  </button>

  {#if visible}
    <div
      class="absolute right-0 bg-gray-300 dark:bg-gray-700 z-50 p-4 min-w-[18rem] max-w-lg text-xs text-gray-700 dark:text-gray-300 rounded-md border border-slate-600"
    >
      <p>{msg}</p>
    </div>
  {/if}
</div>
