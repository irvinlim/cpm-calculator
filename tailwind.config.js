import forms from "@tailwindcss/forms";

export default {
  plugins: [forms],
  theme: {
    extend: {},
  },
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
  variants: {
    extend: {},
  },
};
