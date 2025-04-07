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
				<div class="flex flex-col items-center gap-8">
					<SummaryCard {summary} />

					<div class="mt-4 w-full max-w-2xl text-center">
						<h3 class="mb-4 text-lg font-semibold text-gray-300">Explore the Analysis</h3>
						<div class="flex flex-wrap justify-center gap-4">
							{#if playerStats}
								<button 
									onclick={() => activeTabId = 'stats'}
									class="border-2 border-sky-500 rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition shadow-lg transition-all duration-300 ease-in-out hover:border-sky-400 hover:bg-sky-500 hover:shadow-[0_0_32px_rgba(56,189,248,0.4)]"
								>
									View Detailed Stats
								</button>
							{/if}
							{#if playerInsights?.strengths}
								<button 
									onclick={() => activeTabId = 'strengths'}
									class="border-2 border-green-500 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition hshadow-lg transition-all duration-300 ease-in-out hover:border-green-400 hover:bg-green-500 hover:shadow-[0_0_32px_rgba(0,255,26,0.4)]"
								>
									Discover Strengths
								</button>
							{/if}
							{#if playerInsights?.improvements}
								<button 
									onclick={() => activeTabId = 'improvements'}
									class="border-2 border-orange-500 rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hshadow-lg transition-all duration-300 ease-in-out hover:border-orange-400 hover:bg-orange-500 hover:shadow-[0_0_32px_rgba(255,196,0,0.4)]"
								>
									Get Improvement Tips
								</button>
							{/if}
						</div>
					</div>
				</div>
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