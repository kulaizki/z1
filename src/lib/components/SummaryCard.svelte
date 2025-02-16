<script lang="ts">
  import Markdown from 'svelte-exmarkdown';
  export let summary: string;
</script>

<style>
  /* Global styling for dynamically generated content */
  :global(p) {
    margin-bottom: 1em;
    line-height: 1.6;
  }
</style>

<div class="rounded-lg bg-gradient-to-r from-gray-800 via-black-900 to-gray-800 border border-gray-600 p-8 shadow-md text-white max-w-4xl">
  <h2 class="text-3xl font-extrabold mb-6 text-orange-400">Player Summary</h2>
  <Markdown md={summary} />
</div>
