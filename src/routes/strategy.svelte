<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { SyncLoader } from 'svelte-loading-spinners';
	import {
		fetchMatches,
		fetchSummary,
		fetchPlayerStats,
		fetchInsights,
		refreshOpenDotaProfile
	} from '$lib/services/strategy';
	import DotaIdInput from '$lib/components/dota-id-input.svelte';
	import ProfileError from '$lib/components/profile-error.svelte';
	import RateLimitIndicator from '$lib/components/rate-limit-indicator.svelte';
	import ResultsDisplay from '$lib/components/results-display.svelte';

	// Define types for better clarity
	type Match = Record<string, any>; // Replace 'any' with a specific Match type if available
	type PlayerStats = Record<string, any> | null; // Replace 'any' if possible
	type PlayerInsights = {
		strengths: Array<{ title: string; description: string }>; // Match StrengthsCard prop type
		improvements: Array<{ area: string; recommendation: string }>; // Match ImprovementCard prop type
	} | null;
	type FetchResponse = { rateLimited?: boolean; waitTime?: number; [key: string]: any };

	const dispatch = createEventDispatcher<{ hideIntro: void; analysisLoaded: void }>();

	let dotaId: string | null = $state(null);
	let matches: Match[] = $state([]);
	let error: string | null = $state(null);
	let summary: string | null = $state(null);
	let playerStats: PlayerStats = $state(null);
	let playerInsights: PlayerInsights = $state(null);
	let isLoading: boolean = $state(false);

	// Tracking for successful data fetch
	let summaryFetched: boolean = $state(false);
	let statsFetched: boolean = $state(false);
	let insightsFetched: boolean = $state(false);

	let invalidIdOrPrivateProfile: boolean = $state(false);

	// Rate limiting status
	let summaryRateLimited: boolean = $state(false);
	let insightsRateLimited: boolean = $state(false);
	let summaryWaitTime: number = $state(0);
	let insightsWaitTime: number = $state(0);

	const MIN_MATCH_COUNT = 10;
	const REFRESH_WAIT_MS = 5000;
	const TEST_DOTA_ID = '192117652';

	// Derived state to check if all data has been loaded
	const allDataLoaded = $derived(summaryFetched && statsFetched && insightsFetched);

	async function startFetchProcess(id: string) {
		if (!id) return;

		dispatch('hideIntro');
		isLoading = true;
		error = null;
		invalidIdOrPrivateProfile = false;
		summaryFetched = false;
		statsFetched = false;
		insightsFetched = false;
		summaryRateLimited = false;
		insightsRateLimited = false;
		summaryWaitTime = 0;
		insightsWaitTime = 0;

		// Clear previous results
		matches = [];
		summary = null;
		playerStats = null;
		playerInsights = null;

		try {
			let currentMatches = await fetchMatches(id);

			if (!currentMatches || currentMatches.length < MIN_MATCH_COUNT) {
				console.log(`Initial fetch returned ${currentMatches?.length ?? 0} matches. Attempting refresh for ${id}...`);
				await refreshOpenDotaProfile(id);
				await new Promise(resolve => setTimeout(resolve, REFRESH_WAIT_MS));
				currentMatches = await fetchMatches(id);

				if (!currentMatches || currentMatches.length === 0) {
					console.log(`Match fetch retry still resulted in 0 matches for ${id}.`);
					invalidIdOrPrivateProfile = true;
					isLoading = false;
					return;
				} else {
					console.log(`Match fetch retry successful. Found ${currentMatches.length} matches.`);
				}
			}

			matches = currentMatches; // Assign successfully fetched matches

			// Start subsequent API calls in parallel
			const summaryPromise = fetchSummaryHandler(matches);
			const statsPromise = fetchPlayerStatsHandler(id);
			const insightsPromise = fetchInsightsHandler(matches);

			// Wait for all analysis calls to complete
			await Promise.all([summaryPromise, statsPromise, insightsPromise]);

		} catch (err) {
			console.error("Error during fetch process:", err);
			error = `An error occurred. Please ensure the ID is correct and the profile is public. Details: ${(err as Error).message}`;
			matches = [];
			invalidIdOrPrivateProfile = true; // Assume invalid ID on fetch error
		} finally {
			// Loading state is managed reactively below
			if (invalidIdOrPrivateProfile && isLoading) {
				isLoading = false;
			}
		}
	}

	async function fetchSummaryHandler(matchData: Match[]) {
		try {
			const response: FetchResponse | string = await fetchSummary(matchData);

			if (typeof response === 'object' && response.rateLimited) {
				summaryRateLimited = true;
				summaryWaitTime = response.waitTime || 0;
				if (summaryWaitTime > 0) {
					setTimeout(() => fetchSummaryHandler(matchData), Math.min(summaryWaitTime * 1000, 10000));
				}
				return;
			}

			summary = (typeof response === 'string' ? response : null);
			summaryRateLimited = false;
		} catch (err) {
			console.error("Error fetching summary:", err);
			summary = null;
			error = error || (err as Error).message; // Preserve earlier errors if any
		} finally {
			summaryFetched = true;
		}
	}

	async function fetchPlayerStatsHandler(id: string) {
		try {
			const stats = await fetchPlayerStats(id);
			if (!stats) {
				console.log(`Player stats fetch returned null for ${id}.`);
				invalidIdOrPrivateProfile = true;
				playerStats = null;
			} else {
				playerStats = stats;
			}
		} catch (err) {
			console.error("Error fetching player stats:", err);
			playerStats = null;
			error = error || (err as Error).message;
			invalidIdOrPrivateProfile = true;
		} finally {
			statsFetched = true;
		}
	}

	async function fetchInsightsHandler(matchData: Match[]) {
		try {
			const response: FetchResponse | { strengths: string[]; improvements: string[] } = await fetchInsights(matchData);

			// Check if response contains rate limiting information first
			if (typeof response === 'object' && 'rateLimited' in response && response.rateLimited) {
				insightsRateLimited = true;
				insightsWaitTime = response.waitTime || 0;
				if (insightsWaitTime > 0) {
					setTimeout(() => fetchInsightsHandler(matchData), Math.min(insightsWaitTime * 1000, 10000));
				}
				return; // Exit if rate limited
			}

			// Now check if the response has the expected data structure
			if (typeof response === 'object' && 'strengths' in response && 'improvements' in response) {
				// Directly assign assuming the response structure matches PlayerInsights type
				playerInsights = {
					strengths: response.strengths || [],
					improvements: response.improvements || []
				};
			} else {
				console.warn("Unexpected response structure from fetchInsights:", response);
				playerInsights = null; // Handle unexpected response structure
			}
			insightsRateLimited = false;
		} catch (err) {
			console.error("Error fetching insights:", err);
			playerInsights = null;
			error = error || (err as Error).message;
		} finally {
			insightsFetched = true;
		}
	}

	// Reactive effect to manage loading state AND dispatch event
	$effect(() => {
		if ((allDataLoaded && !summaryRateLimited && !insightsRateLimited) || invalidIdOrPrivateProfile) {
			if (isLoading) {
				isLoading = false;
				if (!invalidIdOrPrivateProfile) { // Only dispatch if data is actually loaded
					dispatch('analysisLoaded'); 
				}
			}
		}
	});

	// Event handlers for DotaIdInput
	function handleSubmitId(event: CustomEvent<string>) {
		const submittedId = event.detail;
		dotaId = submittedId;
		startFetchProcess(submittedId);
	}

	function handleUseTestId() {
		dotaId = TEST_DOTA_ID;
		startFetchProcess(TEST_DOTA_ID);
	}

</script>

<div class="flex flex-col items-center gap-8">
	<DotaIdInput
		initialValue={dotaId ?? ''} 
		showTestButton={!dotaId} 
		on:submitId={handleSubmitId}
		on:useTestId={handleUseTestId}
	/>

	{#if error && !invalidIdOrPrivateProfile}
		<p class="mt-4 text-red-500">{error}</p>
	{/if}

	{#if isLoading}
		<div class="mt-8">
			<SyncLoader size="60" color="#38bdf8" unit="px" duration="1s" />
		</div>
	{:else if invalidIdOrPrivateProfile}
		<ProfileError />
	{:else if summaryRateLimited || insightsRateLimited}
		<RateLimitIndicator
			waitTime={Math.max(summaryWaitTime, insightsWaitTime)}
			message="Analysis API is currently busy. Retrying shortly."
		/>
	{:else if dotaId && allDataLoaded}
		<ResultsDisplay summary={summary ?? null} playerStats={playerStats ?? null} playerInsights={playerInsights ?? null} />
	{/if}
</div>