<script lang="ts">
  import Markdown from 'svelte-exmarkdown';
  export let summary: string;
</script>

<style>
  :global(p) {
    margin-bottom: 1em;
    line-height: 1.6;
  }
</style>

<div class="rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-600 p-8 shadow-md text-white max-w-4xl">
  <h2 class="text-3xl font-extrabold mb-6 text-sky-400 [text-shadow:0_0_8px_rgba(56,189,248,0.6)]">Recent Games Summary</h2>
  <Markdown md={summary} />
</div>
