<script lang="ts">
  import { onMount } from 'svelte';
  import type { ValueWithCurrency } from './types';
  import InputWithCurrency from './InputWithCurrency.svelte';
  import InputNumber from './InputNumber.svelte';

  let rates = new Map<string, number>();
  let currencies: string[] = [];
  onMount(async () => {
    const data = await fetch('https://open.er-api.com/v6/latest/USD');
    rates = (await data.json()).rates;
    currencies = Object.keys(rates);
  });

  let miles: number;
  let milesLost: number;
  let taxes: ValueWithCurrency = {
    currency: 'USD',
    value: null,
  };
  let cost: ValueWithCurrency = {
    currency: 'USD',
    value: null,
  };
  let mileTransferFees: ValueWithCurrency = {
    currency: 'USD',
    value: null,
  };
  let inputCPMCurrency: string = 'USD';

  const toUSD = (vc: ValueWithCurrency): number => {
    if (!vc.value || !vc.currency) {
      return 0;
    }
    return vc.value / rates[vc.currency];
  };

  let cpm: number = 0;
  $: cpm = ((): number => {
    const costUSD = toUSD(cost);
    const taxesUSD = toUSD(taxes);
    const transferUSD = toUSD(mileTransferFees);

    // Compute the mile value, which should subtract taxes and any fees paid.
    const mileValue = (costUSD - taxesUSD - transferUSD) * 100;

    // Compute the final CPM.
    const totalMiles = (miles ?? 0) + (milesLost ?? 0);
    let cpm = mileValue / totalMiles;

    // Prevent NaN.
    if (totalMiles == 0 || cpm < 0) {
      cpm = 0;
    }

    // Convert the CPM into the final currency.
    cpm = cpm * rates[inputCPMCurrency];

    return cpm;
  })();
</script>

<div class="grid grid-cols-1 gap-6 text-gray-800">
  <div>
    <label class="block" for="miles">
      <span>Cost of award ticket (in miles)</span>
    </label>
    <InputNumber id="miles" bind:value={miles} placeholder="e.g. 10000" />
  </div>

  <div>
    <label for="taxes">Taxes and fees</label>
    <InputWithCurrency id="taxes" {currencies} bind:value={taxes} />
  </div>

  <div>
    <label for="cost">Cost of cash ticket</label>
    <InputWithCurrency id="cost" {currencies} bind:value={cost} />
  </div>

  <div>
    <label class="block" for="milesLost">
      <span>Potentially lost miles from accrual (optional)</span>
    </label>
    <InputNumber
      id="milesLost"
      bind:value={milesLost}
      placeholder="e.g. 10000"
    />
  </div>

  <div>
    <label for="mileTransferFees">Mile transfer fees (optional)</label>
    <InputWithCurrency
      id="mileTransferFees"
      {currencies}
      bind:value={mileTransferFees}
    />
  </div>

  <div>
    <label for="total-cpm-other">
      <span>Final CPM</span>
    </label>
    <p>
      <select
        class="select-cpm-currency bg-sky-900 text-gray-100 text-center pt-0 pb-0 pl-2 pr-2 mr-2 rounded-md border-none"
        bind:value={inputCPMCurrency}
      >
        {#each currencies as currency}
          <option>{currency}</option>
        {/each}
      </select>
      <span class="text-gray-300 text-lg">{cpm.toFixed(2)} ¢/mile</span>
    </p>
  </div>
</div>

<style>
  label {
    @apply text-gray-300;
  }

  .select-cpm-currency {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: none;
  }

  .select-cpm-currency::-ms-expand {
    display: none;
  }
</style>
