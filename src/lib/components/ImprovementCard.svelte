<script lang="ts">
	export let improvements: Array<{ area: string; recommendation: string }>;
</script>

<div
	class="w-full rounded-lg border border-gray-600 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-8 text-white shadow-md"
>
	<h2
		class="mb-6 text-3xl font-extrabold text-amber-400 [text-shadow:0_0_8px_rgba(251,191,36,0.6)]"
	>
		Areas for Improvement
	</h2>

	<div class="grid grid-cols-1 gap-4">
		{#if improvements && improvements.length > 0}
			{#each improvements as item}
				<div
					class="rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all duration-300 hover:border-amber-500"
				>
					<div class="flex items-start gap-3">
						<div>
							<h3 class="mb-1 text-lg font-semibold text-amber-300">
								{item.area}
							</h3>
							<p class="text-gray-300">{item.recommendation}</p>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-gray-400">No improvement data available yet</p>
		{/if}
	</div>
</div>
