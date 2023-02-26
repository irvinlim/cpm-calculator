<script lang="ts">
  import type { ValueWithCurrency } from "./types";

  // External props.
  export let currencies: string[];
  export let id: string;
  export let value: ValueWithCurrency;
  function update() {
    value = {
      currency: inputCurrency,
      value: inputValue ? parseFloat(inputValue) : 0,
    };
  }

  // Internal state.
  let inputCurrency: string;
  let inputValue: string;
  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let val = parseFloat(target.value);
    if (isNaN(val)) {
      val = 0;
    }
    inputValue = val.toFixed(2);
  };

  // Set initial value from input prop.
  if (value) {
    inputCurrency = value.currency ?? value.currency;
    inputValue = value.value ? value.value.toFixed(2) : "";
  }
</script>

<div class="relative mt-1 rounded-md shadow-sm">
  <div class="absolute inset-y-0 left-0 flex items-center">
    <label for={`currency-${id}`} class="sr-only">Currency</label>
    <select
      id={`currency-${id}`}
      name={`currency-${id}`}
      class="text-right h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 sm:text-sm"
      bind:value={inputCurrency}
      on:change={update}
    >
      {#each currencies as currency}
        <option>{currency}</option>
      {/each}
    </select>
  </div>
  <input
    type="text"
    name={id}
    {id}
    bind:value={inputValue}
    on:input={update}
    on:change={updateValue}
    class="block w-full border-gray-300 pl-12 sm:text-sm"
    placeholder="0.00"
  />
</div>

<style>
  /* Extracted because of specificity issues with input[type="text"] */
  input[type="text"] {
    @apply pl-20 rounded-md;
  }
</style>
