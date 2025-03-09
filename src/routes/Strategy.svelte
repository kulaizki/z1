<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    fetchMatches,
    fetchSummary,
    fetchPlayerStats,
    fetchInsights,
    handleKeyPress,
  } from '$lib/services/strategy';
  import SummaryCard from '$lib/components/SummaryCard.svelte';
  import StatsCard from '$lib/components/StatsCard.svelte';
  import StrengthsCard from '$lib/components/StrengthsCard.svelte';
  import ImprovementCard from '$lib/components/ImprovementCard.svelte';
  import { SyncLoader } from 'svelte-loading-spinners';

  const dispatch = createEventDispatcher<{ hideIntro: void }>();

  let dotaId: string = '';
  let matches: any[] = [];
  let error: string = '';
  let summary: string = '';
  let playerStats: any = null;
  let playerInsights: any = null;
  let isLoading: boolean = false;
  let isSummaryLoading: boolean = false;
  let isStatsLoading: boolean = false;
  let isInsightsLoading: boolean = false;

  async function fetchMatchesHandler() {
    dispatch('hideIntro');
    isLoading = true;
    isSummaryLoading = true;
    isStatsLoading = true;
    isInsightsLoading = true;
    error = '';

    try {
      // Fetch matches for summary
      matches = await fetchMatches(dotaId);

      // Start API calls in parallel
      const summaryPromise = fetchSummaryHandler();
      const statsPromise = fetchPlayerStatsHandler();
      const insightsPromise = fetchInsightsHandler();

      // Wait for all to complete
      await Promise.all([summaryPromise, statsPromise, insightsPromise]);
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

  async function fetchInsightsHandler() {
    try {
      playerInsights = await fetchInsights(matches);
    } catch (err) {
      playerInsights = {
        strengths: [],
        improvements: [],
      };
      error = (err as Error).message;
    } finally {
      isInsightsLoading = false;
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

  {#if isLoading && (!summary && !playerStats && !playerInsights)}
    <SyncLoader size="60" color="#38bdf8" unit="px" duration="1s" />
  {:else}
    <div class="flex flex-col gap-8 items-center w-full">
      {#if isSummaryLoading}
        <div class="w-full flex justify-center">
          <SyncLoader size="40" color="#38bdf8" unit="px" duration="1s" />
        </div>
      {:else if summary}
        <SummaryCard {summary} />
      {/if}

      {#if isStatsLoading}
        <div class="w-full flex justify-center">
          <SyncLoader size="40" color="#38bdf8" unit="px" duration="1s" />
        </div>
      {:else if playerStats}
        <StatsCard stats={playerStats} />
      {/if}

      {#if isInsightsLoading}
        <div class="w-full flex justify-center">
          <SyncLoader size="40" color="#38bdf8" unit="px" duration="1s" />
        </div>
      {:else if playerInsights}
        <div class="flex flex-wrap justify-center gap-8 w-full">
          {#if playerInsights.strengths && playerInsights.strengths.length > 0}
            <div class="w-full ">
              <StrengthsCard strengths={playerInsights.strengths} />
            </div>
          {/if}

          {#if playerInsights.improvements && playerInsights.improvements.length > 0}
           <div class="w-full ">
              <ImprovementCard improvements={playerInsights.improvements} />
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>