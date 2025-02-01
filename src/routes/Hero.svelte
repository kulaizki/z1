<script lang="ts">
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import Strategy from './Strategy.svelte';

  let show: boolean = false;
  let hideIntro: boolean = false;

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

  function handleHideIntro() {
    hideIntro = true;
  }
</script>

<section class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
  {#if show}
    <div class="max-w-4xl px-6 text-center" transition:blurFly>
      {#if !hideIntro}
        <h1 class="mb-4 text-4xl font-bold tracking-tight md:text-7xl">
          Hi, I'm <span class="text-orange-500">Z1</span>
        </h1>
        <p class="mb-6 text-lg text-gray-300 md:text-xl">
          I'll help you reach your greatest potential in Dota 2.
        </p>
      {/if}
      <Strategy on:hideIntro={handleHideIntro} />
    </div>
  {/if}
</section>