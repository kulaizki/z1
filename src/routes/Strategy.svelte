<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import AdviceCard from '$lib/components/AdviceCard.svelte';

  const dispatch = createEventDispatcher<{ hideIntro: void }>();

  let dotaId: string = '';
  let matches: any[] = [];
  let error: string = '';
  let analysis: string = '';

  async function fetchMatches() {
    dispatch('hideIntro');

    try {
      const response = await fetch(`/api/matches/${dotaId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      matches = await response.json();
      console.log(matches);
      error = '';
      await fetchAnalysis();
    } catch (err) {
      error = (err as Error).message;
      matches = [];
    }
  }

  async function fetchAnalysis() {
    try {
      const response = await fetch(`/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matches })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }
      const data = await response.json();
      console.log('API Response:', data);
      analysis = data.analysis || 'No analysis available at this time.';
    } catch (err) {
      analysis = (err as Error).message;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && dotaId.trim()) {
      fetchMatches();
    }
  }
</script>

<div class="flex flex-col items-center gap-6">
  <input
    type="text"
    placeholder="Enter your Dota 2 ID"
    bind:value={dotaId}
    on:keypress={handleKeyPress}
    class="w-72 text-center rounded-full px-4 py-2 text-black"
  />

  {#if error}
    <p class="mt-4 text-red-500">{error}</p>
  {/if}

  {#if analysis}
    <AdviceCard analysis={analysis} />
  {/if}
</div>