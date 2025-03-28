<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	export let summary: string;
</script>

<div
	class="max-w-4xl rounded-lg border border-gray-600 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-8 text-white shadow-md"
>
	<h2 class="mb-6 text-3xl font-extrabold text-sky-400 [text-shadow:0_0_8px_rgba(56,189,248,0.6)]">
		Recent Games Summary
	</h2>
	<Markdown md={summary} />
</div>

<style>
	:global(p) {
		margin-bottom: 1em;
		line-height: 1.6;
	}

	/* Style the hero names with sky-400 */
	:global(strong) {
		color: rgb(56, 189, 248);
	}
</style>
