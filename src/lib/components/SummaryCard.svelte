<script lang="ts">
  import Markdown from 'svelte-exmarkdown';
  export let summary: string;
</script>

<style>
  /* Apply global styling to dynamically generated <p> elements */
  :global(p) {
    margin-bottom: 1em; 
  }
</style>

<div class="mt-6 rounded-lg bg-slate-800 p-6 shadow-xl text-white max-w-7xl">
  <h2 class="text-2xl font-semibold mb-4 text-orange-500">Player Summary</h2>
  <Markdown md={summary} />
</div>
