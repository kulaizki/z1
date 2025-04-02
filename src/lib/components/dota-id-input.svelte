<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let {
		initialValue = '',
		showTestButton = true
	} = $props<{ initialValue?: string; showTestButton?: boolean }>();

	const dispatch = createEventDispatcher<{ submitId: string; useTestId: void }>();

	let dotaId = $state(initialValue);
	let showButton = $state(showTestButton);
	const testId = '192117652'; // Keep test ID logic contained

	function handleSubmit() {
		if (dotaId.trim()) {
			dispatch('submitId', dotaId);
			showButton = false; // Hide button after any submission
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevent potential form submission if wrapped
			handleSubmit();
		}
	}

	function handleUseTestId() {
		dotaId = testId;
		dispatch('useTestId'); // Dispatch event to signal test ID usage
		handleSubmit(); // Automatically submit after setting test ID
	}
</script>

<div class="flex flex-col items-center gap-4">
	<input
		type="text"
		placeholder="Enter your Dota 2 ID"
		bind:value={dotaId}
		on:keypress={handleKeyPress}
		class="w-80 rounded-full px-4 py-2 text-center text-black"
	/>

	{#if showButton}
		<button
			class="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-sm text-sky-400 transition-colors hover:text-sky-300"
			on:click={handleUseTestId}
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
			Try with the creator's ID: <span class="font-bold text-sky-200">{testId}</span>
		</button>
	{/if}
</div> 