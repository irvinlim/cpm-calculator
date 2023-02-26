<script lang="ts">
  import { formatNumber, parseNumber } from "./utils";

  // External props.
  export let id: string;
  export let placeholder: string;
  export let value: number;
  function update() {
    let val = parseNumber(inputValue);
    if (!isNaN(val)) {
      value = val;
    }
  }

  // Internal state.
  let inputValue: string = value ? formatNumber(value) : "";
  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let val = parseNumber(target.value);
    if (isNaN(val)) {
      val = 0;
    }
    inputValue = formatNumber(val);
  };
</script>

<input
  bind:value={inputValue}
  on:input={update}
  on:change={updateValue}
  on:blur={update}
  class="text-gray-500 border-gray-300 mt-1 block w-full"
  type="text"
  {id}
  name={id}
  {placeholder}
/>

<style>
  /* Extracted because of specificity issues with input[type="text"] */
  input[type="text"] {
    @apply rounded-md;
  }
</style>
