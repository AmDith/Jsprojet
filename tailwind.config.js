/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}", // Ton chemin aux fichiers HTML et JS
    "./node_modules/flowbite/**/*.js", // Inclure les composants Flowbite
  ],
  theme: {
    extend: {}, // Ajouter ici tes personnalisations Tailwind
  },
  plugins: [
    require("flowbite/plugin"), // Charger Flowbite comme plugin
  ],
};
