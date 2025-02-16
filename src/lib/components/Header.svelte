<script lang="ts">
  import { onMount } from "svelte";
  let scrolled = false;

  onMount(() => {
    window.addEventListener("scroll", () => {
      scrolled = window.scrollY > 10;
    });
  });
</script>

<header class="text-white fixed top-0 left-0 w-full transition-all duration-300 ease-in-out z-50"
  class:scrolled={scrolled}>
  <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
    <a href="/" class="text-2xl font-bold text-orange-500">Z1 Dota</a>
    <nav class="flex space-x-6">
      <a href="/" class="hover:text-orange-400">Home</a>
      <a href="/meta" class="hover:text-orange-400">Meta</a>
      <a href="/match-history" class="hover:text-orange-400">Match History</a>
      <a href="/privacy-policy" class="hover:text-orange-400">Privacy Policy</a>
    </nav>
  </div>
</header>

<style>
  .scrolled {
    background-color: #1f2937; /* gray-800 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>