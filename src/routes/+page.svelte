<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let show: boolean = false;

	function blurFly(
		node: HTMLElement,
		params: {
			delay?: number;
			duration?: number;
			easing?: (t: number) => number;
		} = {}
	): {
		delay: number;
		duration: number;
		easing: (t: number) => number;
		css: (t: number) => string;
	} {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');
		return {
			delay: params.delay || 0,
			duration: params.duration || 1000,
			easing: params.easing || cubicOut,
			css: (t: number) => `
        transform: ${existingTransform} translateY(${(1 - t) * 100}px);
        opacity: ${t};
        filter: blur(${(1 - t) * 10}px);
      `
		};
	}

	onMount(() => {
		show = true;
	});
</script>

<section
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
>
	{#if show}
		<div class="max-w-4xl px-6 text-center" transition:blurFly>
			<h1 class="mb-4 text-4xl font-bold tracking-tight md:text-7xl">
				Hi, I'm <span class="text-sky-400">Zel</span>
			</h1>
			<p class="mb-6 text-lg text-gray-300 md:text-xl">
				An AI-powered tool to help you reach your full potential in Dota 2.
			</p>
			<div class="flex justify-center gap-6">
				<a
					href="#experience"
					class="rounded-full bg-sky-500 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:bg-sky-600"
				>
					Start Now
				</a>
				<a
					href="#contact"
					class="rounded-full bg-gray-700 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:bg-gray-600"
				>
					Documentation
				</a>
			</div>
		</div>
	{/if}
</section>
