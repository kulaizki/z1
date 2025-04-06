<script lang="ts">
	type Improvement = {
		area: string;
		recommendation: string;
	};
	let { improvements = [] } = $props<{ improvements: Improvement[] }>();
</script>

<div
	class="w-full rounded-lg border border-gray-600 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-4 text-white shadow-md md:p-8"
>
	<h2
		class="mb-4 text-2xl font-extrabold text-amber-400 [text-shadow:0_0_8px_rgba(251,191,36,0.6)] md:mb-6 md:text-3xl"
	>
		Areas for Improvement
	</h2>

	<div class="grid grid-cols-1 gap-3 md:gap-4">
		{#if improvements && improvements.length > 0}
			{#each improvements as item}
				<div
					class="rounded-lg border border-gray-700 bg-gray-800 p-3 transition-all duration-300 hover:border-amber-500 md:p-4"
				>
					<div class="flex w-full items-center justify-center text-center">
						<div class="w-full">
							<h3 class="mb-1 text-base font-semibold text-amber-300 md:text-lg">
								{item.area}
							</h3>
							<p class="text-sm text-gray-300 md:text-base">{item.recommendation}</p>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-gray-400">No improvement data available yet</p>
		{/if}
	</div>
</div>
