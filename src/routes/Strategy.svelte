<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fetchMatches, fetchAnalysis, handleKeyPress } from '$lib/services/strategy';
  import AdviceCard from '$lib/components/AdviceCard.svelte';

  const dispatch = createEventDispatcher<{ hideIntro: void }>();

  let dotaId: string = '';
  let matches: any[] = [];
  let error: string = '';
  let analysis: string = '';

  async function fetchMatchesHandler() {
    dispatch('hideIntro');
    try {
      matches = await fetchMatches(dotaId);
      error = '';
      await fetchAnalysisHandler();
    } catch (err) {
      error = (err as Error).message;
      matches = [];
    }
  }

  async function fetchAnalysisHandler() {
    try {
      analysis = await fetchAnalysis(matches);
    } catch (err) {
      analysis = (err as Error).message;
    }
  }

  function handleKeyPressWrapper(event: KeyboardEvent) {
    handleKeyPress(event, dotaId, fetchMatchesHandler);
  }
</script>

<div class="flex flex-col items-center gap-6">
  <input
    type="text"
    placeholder="Enter your Dota 2 ID"
    bind:value={dotaId}
    on:keypress={handleKeyPressWrapper}
    class="w-72 text-center rounded-full px-4 py-2 text-black"
  />

  {#if error}
    <p class="mt-4 text-red-500">{error}</p>
  {/if}

  {#if analysis}
    <AdviceCard analysis={analysis} />
  {/if}
</div>