<script lang="ts">
  import "./tailwind.css";
  import logoUrl from "./assets/ticket.png";
  import Calculator from "./lib/Calculator.svelte";
</script>

<main class="w-full">
  <section class="header">
    <div class="logo-container">
      <img src={logoUrl} class="inline h-48 mb-8" alt="Logo" />
    </div>
    <h1 class="text-4xl mb-4 font-semibold">CPM Calculator</h1>

    <h2 class="text-lg mb-2">
      Calculate the true CPM (cents per mile) value of an award flight with this
      online calculator.
    </h2>
  </section>

  <div class="card">
    <Calculator />
  </div>
</main>

<section class="footer">
  <p class="copyright mb-4">
    <a
      href="https://github.com/irvinlim/cpm-calculator"
      rel="noreferrer"
      target="_blank">GitHub</a
    >
  </p>
  <p class="copyright">
    Copyright &copy; {new Date().getFullYear()} Irvin Lim. All rights reserved.
  </p>
  <p class="copyright">
    Airplane ticket icon created by <a
      href="https://www.flaticon.com/free-icons/airplane-ticket"
      rel="noreferrer"
      target="_blank">lutfix on Flaticon</a
    >.
  </p>
  <p class="copyright">
    Rates by <a
      href="https://www.exchangerate-api.com"
      rel="noreferrer"
      target="_blank">Exchange Rate API</a
    >.
  </p>
</section>

<style>
  section.header {
    text-align: center;
  }
  .copyright {
    text-align: center;
    color: #888;
    font-size: smaller;
  }
  .copyright a {
    @apply text-blue-400;
  }
</style>
