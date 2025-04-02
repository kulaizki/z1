<script lang="ts">
	import SummaryCard from '$lib/components/summary-card.svelte';
	import StatsCard from '$lib/components/stats-card.svelte';
	import StrengthsCard from '$lib/components/strengths-card.svelte';
	import ImprovementCard from '$lib/components/improvement-card.svelte';

	// Define types locally or import if defined elsewhere
	// Replace 'any' with a more specific type if available for playerStats
	type PlayerStats = Record<string, any> | null;
	type PlayerInsights = {
		strengths: string[];
		improvements: string[];
	} | null;

	// Define props using $props
	let {
		summary,
		playerStats,
		playerInsights
	} = $props<{
		summary: string | null;
		playerStats: PlayerStats;
		playerInsights: PlayerInsights;
	}>();
</script>

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