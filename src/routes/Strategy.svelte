<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		fetchMatches,
		fetchSummary,
		fetchPlayerStats,
		fetchInsights,
		handleKeyPress
	} from '$lib/services/strategy';
	import SummaryCard from '$lib/components/SummaryCard.svelte';
	import StatsCard from '$lib/components/StatsCard.svelte';
	import StrengthsCard from '$lib/components/StrengthsCard.svelte';
	import ImprovementCard from '$lib/components/ImprovementCard.svelte';
	import ApiBusyIndicator from '$lib/components/ApiBusyIndicator.svelte';
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
	let showTestIdButton: boolean = true;

	// Rate limiting status
	let summaryRateLimited: boolean = false;
	let insightsRateLimited: boolean = false;
	let summaryWaitTime: number = 0;
	let insightsWaitTime: number = 0;

	async function fetchMatchesHandler() {
		dispatch('hideIntro');
		isLoading = true;
		isSummaryLoading = true;
		isStatsLoading = true;
		isInsightsLoading = true;
		error = '';

		// Hide the test ID button once any search is initiated
		showTestIdButton = false;

		// Reset rate limiting status
		summaryRateLimited = false;
		insightsRateLimited = false;
		summaryWaitTime = 0;
		insightsWaitTime = 0;

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
			const response = await fetchSummary(matches);

			// Check if response contains rate limiting information
			if (response.rateLimited) {
				summaryRateLimited = true;
				summaryWaitTime = response.waitTime || 0;

				// Poll until the rate limit is lifted
				if (summaryWaitTime > 0) {
					setTimeout(
						async () => {
							isSummaryLoading = true;
							await fetchSummaryHandler();
						},
						Math.min(summaryWaitTime * 1000, 10000)
					); // Wait at most 10 seconds between retries
				}
				return;
			}

			summary = response || '';
			summaryRateLimited = false;
		} catch (err) {
			summary = '';
			error = (err as Error).message;
		} finally {
			if (!summaryRateLimited) {
				isSummaryLoading = false;
			}
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
			const response = await fetchInsights(matches);

			// Check if response contains rate limiting information
			if (response.rateLimited) {
				insightsRateLimited = true;
				insightsWaitTime = response.waitTime || 0;

				// Poll until the rate limit is lifted
				if (insightsWaitTime > 0) {
					setTimeout(
						async () => {
							isInsightsLoading = true;
							await fetchInsightsHandler();
						},
						Math.min(insightsWaitTime * 1000, 10000)
					); // Wait at most 10 seconds between retries
				}
				return;
			}

			playerInsights = {
				strengths: response.strengths || [],
				improvements: response.improvements || []
			};
			insightsRateLimited = false;
		} catch (err) {
			playerInsights = {
				strengths: [],
				improvements: []
			};
			error = (err as Error).message;
		} finally {
			if (!insightsRateLimited) {
				isInsightsLoading = false;
			}
		}
	}

	function handleKeyPressWrapper(event: KeyboardEvent) {
		handleKeyPress(event, dotaId, fetchMatchesHandler);
	}

	function useTestId() {
		dotaId = '192117652';
		fetchMatchesHandler();
	}
</script>

<div class="flex flex-col items-center gap-8">
	<input
		type="text"
		placeholder="Enter your Dota 2 ID"
		bind:value={dotaId}
		on:keypress={handleKeyPressWrapper}
		class="w-80 rounded-full px-4 py-2 text-center text-black"
	/>

	{#if showTestIdButton}
		<button
			class="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-sm text-sky-400 transition-colors hover:text-sky-300"
			on:click={useTestId}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path
					d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
				></path>
			</svg>
			Try with the creator's ID: <span class="font-bold text-sky-200">192117652</span>
		</button>
	{/if}

	{#if error}
		<p class="mt-4 text-red-500">{error}</p>
	{/if}

	{#if isLoading && !summary && !playerStats && !playerInsights}
		<SyncLoader size="60" color="#38bdf8" unit="px" duration="1s" />
	{:else}
		<div class="flex w-full flex-col items-center gap-8">
			<!-- Summary -->
			{#if summaryRateLimited}
				<ApiBusyIndicator
					waitTime={summaryWaitTime}
					message="Analysis API is currently busy. Please wait."
				/>
			{:else if isSummaryLoading}
				<div class="flex w-full justify-center">
					<SyncLoader size="40" color="#38bdf8" unit="px" duration="1s" />
				</div>
			{:else if summary}
				<SummaryCard {summary} />
			{/if}

			<!-- Stats -->
			{#if isStatsLoading}
				<div class="flex w-full justify-center">
					<SyncLoader size="40" color="#38bdf8" unit="px" duration="1s" />
				</div>
			{:else if playerStats}
				<StatsCard stats={playerStats} />
			{/if}

			<!-- Insights -->
			{#if insightsRateLimited}
				<ApiBusyIndicator
					waitTime={insightsWaitTime}
					message="Insights API is currently busy. Please wait."
				/>
			{:else if isInsightsLoading}
				<div class="flex w-full justify-center">
					<SyncLoader size="40" color="#38bdf8" unit="px" duration="1s" />
				</div>
			{:else if playerInsights}
				<div class="flex w-full flex-wrap justify-center gap-8">
					{#if playerInsights.strengths && playerInsights.strengths.length > 0}
						<div class="w-full">
							<StrengthsCard strengths={playerInsights.strengths} />
						</div>
					{/if}

					{#if playerInsights.improvements && playerInsights.improvements.length > 0}
						<div class="w-full">
							<ImprovementCard improvements={playerInsights.improvements} />
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
