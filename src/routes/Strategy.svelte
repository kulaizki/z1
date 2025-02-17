<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fetchMatches, fetchSummary, handleKeyPress } from '$lib/services/strategy';
  import SummaryCard from '$lib/components/SummaryCard.svelte';
  import { SyncLoader } from 'svelte-loading-spinners';

  const dispatch = createEventDispatcher<{ hideIntro: void }>();

  let dotaId: string = '';
  let matches: any[] = [];
  let error: string = '';
  let summary: string = '';
  let isLoading: boolean = false;

  async function fetchMatchesHandler() {
    dispatch('hideIntro');
    isLoading = true;
    try {
      matches = await fetchMatches(dotaId);
      error = '';
      await fetchSummaryHandler();
    } catch (err) {
      error = (err as Error).message;
      matches = [];
    } finally {
      isLoading = false;
    }
  }

  async function fetchSummaryHandler() {
    try {
      summary = await fetchSummary(matches);
    } catch (err) {
      summary = (err as Error).message;
    }
  }

  function handleKeyPressWrapper(event: KeyboardEvent) {
    handleKeyPress(event, dotaId, fetchMatchesHandler);
  }
</script>

<div class="flex flex-col items-center gap-12">
  <input
    type="text"
    placeholder="Enter your Dota 2 ID"
    bind:value={dotaId}
    on:keypress={handleKeyPressWrapper}
    class="w-80 text-center rounded-full px-4 py-2 text-black"
  />

  {#if error}
    <p class="mt-4 text-red-500">{error}</p>
  {/if}

  {#if isLoading}
    <SyncLoader size="60" color="#ff8800" unit="px" duration="1s" />
  {:else if summary}
    <SummaryCard {summary} />
  {/if}
</div>

