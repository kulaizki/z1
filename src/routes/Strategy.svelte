<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fetchMatches, fetchSummary, fetchPlayerStats, handleKeyPress } from '$lib/services/strategy';
  import SummaryCard from '$lib/components/SummaryCard.svelte';
  import StatsCard from '$lib/components/StatsCard.svelte';
  import { SyncLoader } from 'svelte-loading-spinners';

  const dispatch = createEventDispatcher<{ hideIntro: void }>();

  let dotaId: string = '';
  let matches: any[] = [];
  let error: string = '';
  let summary: string = '';
  let playerStats: any = null;
  let isLoading: boolean = false;
  let isSummaryLoading: boolean = false;
  let isStatsLoading: boolean = false;

  async function fetchMatchesHandler() {
    dispatch('hideIntro');
    isLoading = true;
    isSummaryLoading = true;
    isStatsLoading = true;
    error = '';
    
    try {
      // Fetch matches for summary
      matches = await fetchMatches(dotaId);
      
      // Start both API calls in parallel
      const summaryPromise = fetchSummaryHandler();
      const statsPromise = fetchPlayerStatsHandler();
      
      // Wait for both to complete
      await Promise.all([summaryPromise, statsPromise]);
      
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
      summary = '';
      error = (err as Error).message;
    } finally {
      isSummaryLoading = false;
    }
  }
  
  async function fetchPlayerStatsHandler() {
    try {
      playerStats = await fetchPlayerStats(dotaId);
    } catch (err) {
      playerStats = null;
      error = (err as Error).message;
    } finally {
      isStatsLoading = false;
    }
  }

  function handleKeyPressWrapper(event: KeyboardEvent) {
    handleKeyPress(event, dotaId, fetchMatchesHandler);
  }
</script>

<div class="flex flex-col items-center gap-8">
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

  {#if isLoading && (!summary && !playerStats)}
    <SyncLoader size="60" color="#38bdf8" unit="px" duration="1s" />
  {:else}
    <div class="flex flex-col gap-8 items-center w-full">
      {#if isStatsLoading}
        <div class="w-full flex justify-center">
          <SyncLoader size="40" color="#38bdf8" unit="px" duration="1s" />
        </div>
      {:else if playerStats}
        <StatsCard stats={playerStats} />
      {/if}

      {#if isSummaryLoading}
        <div class="w-full flex justify-center">
          <SyncLoader size="40" color="#38bdf8" unit="px" duration="1s" />
        </div>
      {:else if summary}
        <SummaryCard {summary} />
      {/if}
    </div>
  {/if}
</div>