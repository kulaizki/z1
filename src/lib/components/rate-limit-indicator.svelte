<script lang="ts">
	import ApiBusyIndicator from '$lib/components/api-busy-indicator.svelte';

	let { waitTime, message } = $props<{ waitTime: number; message: string }>();
</script>

<ApiBusyIndicator {waitTime} {message} /> 