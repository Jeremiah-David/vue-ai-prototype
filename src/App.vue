<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <div class="mb-8 flex gap-4">
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>

    <HelloWorld msg="Vite + Vue" />

    <!-- Tailwind test -->
    <div class="mt-8 p-6 bg-blue-500 text-white rounded-lg shadow-lg">
      🎉 Tailwind CSS v3 is working!
    </div>

    <!-- Additional Tailwind test elements -->
    <div class="m-4 flex gap-4">
      <button class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
        Green Button
      </button>
      <button class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
        Red Button
      </button>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>