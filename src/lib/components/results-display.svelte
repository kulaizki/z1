<script lang="ts">
	import SummaryCard from '$lib/components/summary-card.svelte';
	import StatsCard from '$lib/components/stats-card.svelte';
	import StrengthsCard from '$lib/components/strengths-card.svelte';
	import ImprovementCard from '$lib/components/improvement-card.svelte';
	import TabList from '$lib/components/tab-list.svelte';

	type PlayerStats = Record<string, any> | null;
	type PlayerInsights = {
		strengths: Array<{ title: string; description: string }>; 
		improvements: Array<{ area: string; recommendation: string }>;
	} | null;
	
	type Tab = {
		id: string;
		label: string;
	};

	let {
		summary,
		playerStats,
		playerInsights
	} = $props<{
		summary: string | null;
		playerStats: PlayerStats;
		playerInsights: PlayerInsights;
	}>();

	const tabs: Tab[] = [
		{ id: 'summary', label: 'Summary' },
		{ id: 'stats', label: 'Stats' },
		{ id: 'strengths', label: 'Strengths' },
		{ id: 'improvements', label: 'Tips' }
	];

	let activeTabId: string = $state(tabs[0].id);

</script>

<div class="flex w-full flex-col items-center gap-8">
	<TabList bind:activeTabId {tabs} />

	<div class="w-full">
		{#if activeTabId === 'summary'}
			{#if summary}
				<SummaryCard {summary} />
			{:else}
				<p class="text-center text-gray-400">Summary data not available.</p>
			{/if}
		{:else if activeTabId === 'stats'}
			{#if playerStats}
				<StatsCard stats={playerStats} />
			{:else}
				<p class="text-center text-gray-400">Stats data not available.</p>
			{/if}
		{:else if activeTabId === 'strengths'}
			{#if playerInsights?.strengths && playerInsights.strengths.length > 0}
				<StrengthsCard strengths={playerInsights.strengths} />
			{:else}
				<p class="text-center text-gray-400">Strengths data not available.</p>
			{/if}
		{:else if activeTabId === 'improvements'}
			{#if playerInsights?.improvements && playerInsights.improvements.length > 0}
				<ImprovementCard improvements={playerInsights.improvements} />
			{:else}
				<p class="text-center text-gray-400">Improvement data not available.</p>
			{/if}
		{/if}
	</div>
</div> 