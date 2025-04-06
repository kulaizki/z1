<script lang="ts">
	type Strength = {
		title: string;
		description: string;
	};
	let { strengths = [] } = $props<{ strengths: Strength[] }>();
</script>

<div
	class="w-full rounded-lg border border-gray-600 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-4 text-white shadow-md md:p-8"
>
	<h2
		class="mb-4 text-2xl font-extrabold text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.6)] md:mb-6 md:text-3xl"
	>
		Strengths
	</h2>

	<div class="grid grid-cols-1 gap-3 md:gap-4">
		{#if strengths && strengths.length > 0}
			{#each strengths as strength}
				<div
					class="rounded-lg border border-gray-700 bg-gray-800 p-3 transition-all duration-300 hover:border-green-500 md:p-4"
				>
					<div class="flex w-full items-center justify-center text-center">
						<div class="w-full">
							<h3 class="mb-1 text-base font-semibold text-green-300 md:text-lg">
								{strength.title}
							</h3>
							<p class="text-sm text-gray-300 md:text-base">{strength.description}</p>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-gray-400">No strengths data available yet</p>
		{/if}
	</div>
</div>
