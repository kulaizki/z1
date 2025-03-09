<script lang="ts">
	export let strengths: Array<{ title: string; description: string }>;
</script>

<div
	class="w-full rounded-lg border border-gray-600 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-8 text-white shadow-md"
>
	<h2
		class="mb-6 text-3xl font-extrabold text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.6)]"
	>
		Player Strengths
	</h2>

	<div class="grid grid-cols-1 gap-4">
		{#if strengths && strengths.length > 0}
			{#each strengths as strength}
				<div
					class="rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all duration-300 hover:border-green-500"
				>
					<div class="flex items-start">
						<div>
							<h3 class="mb-1 text-lg font-semibold text-green-300">
								{strength.title}
							</h3>
							<p class="text-gray-300">{strength.description}</p>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-gray-400">No strengths data available yet</p>
		{/if}
	</div>
</div>
