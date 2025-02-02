<script lang="ts">
  import Markdown from 'svelte-exmarkdown';
  export let analysis: string;
</script>

<div class="mt-6 rounded-lg bg-slate-800 p-6 shadow-xl text-white max-w-7xl">
  <h2 class="text-2xl font-semibold mb-4 text-orange-500">Analysis</h2>
  <Markdown md={analysis} />
</div>
