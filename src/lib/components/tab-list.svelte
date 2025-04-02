<script lang="ts">
	type Tab = {
		id: string;
		label: string;
	};

	let { tabs = [] as Tab[], activeTabId = $bindable('') } = $props();

	function selectTab(id: string) {
		activeTabId = id;
	}
</script>

<div class="mb-6 border-b border-gray-700">
	<nav class="-mb-px grid grid-cols-4" aria-label="Tabs">
		{#each tabs as tab (tab.id)}
			<button
				onclick={() => selectTab(tab.id)}
				class="whitespace-nowrap border-b-2 px-1 py-3 text-center text-sm font-medium transition-colors duration-200 md:text-base"
				class:border-sky-400={activeTabId === tab.id}
				class:text-sky-400={activeTabId === tab.id}
				class:border-transparent={activeTabId !== tab.id}
				class:text-gray-400={activeTabId !== tab.id}
				class:hover:border-gray-400={activeTabId !== tab.id}
				class:hover:text-gray-200={activeTabId !== tab.id}
				aria-current={activeTabId === tab.id ? 'page' : undefined}
			>
				{tab.label}
			</button>
		{/each}
	</nav>
</div> 