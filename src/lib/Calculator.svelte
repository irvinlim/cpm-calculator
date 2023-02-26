<script lang="ts">
  import { onMount } from 'svelte';
  import type { ValueWithCurrency } from './types';
  import InputWithCurrency from './InputWithCurrency.svelte';
  import InputNumber from './InputNumber.svelte';
  import Popover from './Popover.svelte';
  import { formatCurrency, formatNumber, parseNumber } from './utils';

  let rates = new Map<string, number>();
  let ratesLastUpdated = new Date();
  let currencies: string[] = [];
  onMount(async () => {
    const data = await fetch('https://open.er-api.com/v6/latest/USD');
    const json = await data.json();
    rates = json.rates;
    ratesLastUpdated = new Date(json.time_last_update_unix * 1000);
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

  $: totalMiles = (miles ?? 0) + (milesLost ?? 0);

  $: costUSD = toUSD(cost);
  $: taxesUSD = toUSD(taxes);
  $: transferUSD = toUSD(mileTransferFees);
  $: totalUSDValue = costUSD - taxesUSD - transferUSD;

  let cpm: number = 0;
  $: cpm = ((): number => {
    // Compute the mile value, which should subtract taxes and any fees paid.
    const mileValue = totalUSDValue * 100;

    // Compute the final CPM.
    let cpm = mileValue / totalMiles;

    // Prevent NaN.
    if (totalMiles == 0 || cpm < 0) {
      cpm = 0;
    }

    return cpm;
  })();
</script>

<div class="grid grid-cols-1 gap-6 text-gray-800">
  <div>
    <label
      class="flex justify-between text-gray-700 dark:text-gray-300"
      for="miles"
    >
      <span>Cost of award ticket (in miles)</span>
      <Popover msg="Total number of miles of the award flight in question." />
    </label>
    <InputNumber id="miles" bind:value={miles} placeholder="e.g. 10000" />
  </div>

  <div>
    <label
      class="flex justify-between text-gray-700 dark:text-gray-300"
      for="taxes"
    >
      <span>Taxes and fees</span>
      <span class="ml-2">
        <Popover
          msg="Total taxes and fees to be paid when redeeming the award flight."
        />
      </span>
    </label>
    <InputWithCurrency id="taxes" {currencies} bind:value={taxes} />
  </div>

  <div>
    <label
      class="flex justify-between text-gray-700 dark:text-gray-300"
      for="cost"
    >
      <span>Cost of revenue ticket</span>
      <Popover
        msg="The cost of the revenue (cash) ticket that you would otherwise purchase if not using miles."
      />
    </label>
    <InputWithCurrency id="cost" {currencies} bind:value={cost} />
  </div>

  <div>
    <label
      class="flex justify-between text-gray-700 dark:text-gray-300"
      for="milesLost"
    >
      <span>Potentially lost miles from accrual (optional)</span>
      <Popover
        msg="Optionally specify the amount of miles that you will forgo from redeeming an award flight, as compared to accruing miles on the flight when purchased with cash."
      />
    </label>
    <InputNumber
      id="milesLost"
      bind:value={milesLost}
      placeholder="e.g. 10000"
    />
  </div>

  <div>
    <label
      class="flex justify-between text-gray-700 dark:text-gray-300"
      for="mileTransferFees"
    >
      <span>Mile transfer fees (if any)</span>
      <Popover
        msg="Optionally specify any additional fees to transfer miles from credit card partners to the desired frequent flyer account."
      />
    </label>
    <InputWithCurrency
      id="mileTransferFees"
      {currencies}
      bind:value={mileTransferFees}
    />
  </div>

  <div>
    <label class="text-gray-700 dark:text-gray-300" for="total-cpm-other">
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
      <span class="text-gray-700 dark:text-gray-300 text-lg">
        {formatCurrency(cpm * rates[inputCPMCurrency])}¢ / mile
      </span>
    </p>
  </div>

  {#if cpm > 0}
    <div
      class="text-gray-700 dark:text-gray-300 pl-8 pr-8 pt-6 pb-6 bg-gray-300 dark:bg-gray-700"
    >
      <h3 class="text-lg font-bold mb-2">Calculation</h3>
      <p>
        <span class="font-medium">Total cost in miles:</span>
        {formatNumber(totalMiles)} miles
      </p>
      <p>
        <span class="font-medium">Ticket value after fees:</span>
        USD ${formatCurrency(totalUSDValue)}
      </p>
      <p>
        <span class="font-medium">Cents per mile (CPM):</span>
        USD ${formatCurrency(totalUSDValue)} ÷ {formatNumber(totalMiles)}
        = USD {cpm.toFixed(2)}¢ / mile
      </p>
    </div>
  {/if}

  <div>
    <p class="text-gray-500 dark:text-gray-100 text-xs">
      Exchange rates are accurate as of {ratesLastUpdated.toLocaleString()} (local
      browser time). Information is provided 'as is' and solely for informational
      purposes.
    </p>
  </div>
</div>

<style>
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
