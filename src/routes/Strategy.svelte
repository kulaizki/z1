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
	let showTestIdButton: boolean = true;
	
	// Tracking for successful data fetch
	let summaryFetched: boolean = false;
	let statsFetched: boolean = false;
	let insightsFetched: boolean = false;
	
	// Flag for invalid ID or private profile
	let invalidIdOrPrivateProfile: boolean = false;

	// Rate limiting status
	let summaryRateLimited: boolean = false;
	let insightsRateLimited: boolean = false;
	let summaryWaitTime: number = 0;
	let insightsWaitTime: number = 0;

	// Check if all data has been loaded
	$: allDataLoaded = summaryFetched && statsFetched && insightsFetched;

	async function fetchMatchesHandler() {
		dispatch('hideIntro');
		isLoading = true;
		error = '';
		invalidIdOrPrivateProfile = false;

		// Reset status flags
		summaryFetched = false;
		statsFetched = false;
		insightsFetched = false;

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
			
			// Check if matches returned is null or empty array
			if (!matches || matches.length === 0) {
				invalidIdOrPrivateProfile = true;
				isLoading = false;
				return;
			}

			// Start API calls in parallel
			const summaryPromise = fetchSummaryHandler();
			const statsPromise = fetchPlayerStatsHandler();
			const insightsPromise = fetchInsightsHandler();

			// Wait for all to complete
			await Promise.all([summaryPromise, statsPromise, insightsPromise]);
		} catch (err) {
			error = (err as Error).message;
			matches = [];
			invalidIdOrPrivateProfile = true;
			isLoading = false;
		} finally {
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
							await fetchSummaryHandler();
						},
						Math.min(summaryWaitTime * 1000, 10000)
					); // Wait at most 10 seconds between retries
				}
				return;
			}

			summary = response || '';
			summaryRateLimited = false;
			summaryFetched = true;
		} catch (err) {
			summary = '';
			error = (err as Error).message;
			summaryFetched = true; // Mark as fetched even on error to avoid infinite loading
		}
	}

	async function fetchPlayerStatsHandler() {
		try {
			playerStats = await fetchPlayerStats(dotaId);
			
			// Check if player stats is null
			if (!playerStats) {
				invalidIdOrPrivateProfile = true;
				statsFetched = true;
				return;
			}
			
			statsFetched = true;
		} catch (err) {
			playerStats = null;
			error = (err as Error).message;
			invalidIdOrPrivateProfile = true;
			statsFetched = true; // Mark as fetched even on error
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
			insightsFetched = true;
		} catch (err) {
			playerInsights = {
				strengths: [],
				improvements: []
			};
			error = (err as Error).message;
			insightsFetched = true; // Mark as fetched even on error
		}
	}

	// Update loading state whenever all data states change
	$: {
		if (allDataLoaded && !summaryRateLimited && !insightsRateLimited) {
			isLoading = false;
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

	{#if error && !invalidIdOrPrivateProfile}
		<p class="mt-4 text-red-500">{error}</p>
	{/if}

	{#if isLoading}
		<SyncLoader size="60" color="#38bdf8" unit="px" duration="1s" />
	{:else if invalidIdOrPrivateProfile}
		<div class="mt-8 flex flex-col items-center gap-4 text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="64"
				height="64"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#ff5555"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
			<h2 class="text-xl font-bold text-red-400">Profile Not Found</h2>
			<p class="max-w-md text-gray-300">
				The Dota 2 ID you entered is either invalid or your match history is set to private.
				Please check your ID and make sure your match data is public in your Dota 2 settings.
			</p>
			<a
				href="https://www.opendota.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="mt-2 text-sky-400 hover:text-sky-300"
			>
				Visit OpenDota to check your profile
			</a>
		</div>
	{:else if summaryRateLimited || insightsRateLimited}
		<ApiBusyIndicator
			waitTime={Math.max(summaryWaitTime, insightsWaitTime)}
			message="Analysis API is currently busy. Please wait."
		/>
	{:else}
		<div class="flex w-full flex-col items-center gap-8">
			<!-- Summary -->
			{#if summary}
				<SummaryCard {summary} />
			{/if}

			<!-- Stats -->
			{#if playerStats}
				<StatsCard stats={playerStats} />
			{/if}

			<!-- Insights -->
			{#if playerInsights}
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