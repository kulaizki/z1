<script lang="ts">
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import Header from '$lib/components/header.svelte';
  import Footer from '$lib/components/footer.svelte';
  import Strategy from './strategy.svelte';

  let show: boolean = $state(false);
  let hideIntro: boolean = $state(false);
  let analysisIsReady: boolean = $state(false);

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
      duration: params.duration || 1500,
      easing: params.easing || cubicOut,
      css: (t: number) => `
        transform: ${existingTransform} translateY(${(1 - t) * 100}px);
        opacity: ${t};
        filter: blur(${(1 - t) * 10}px);
      `
    };
  }

  $effect(() => {
    show = true;
  });

  function handleHideIntro() {
    hideIntro = true;
  }

  function handleAnalysisLoaded() {
    analysisIsReady = true;
  }
</script>

<div class="flex flex-col min-h-screen">
  <!-- <Header /> -->
  <section 
    class="flex-grow flex flex-col items-center p-8 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    class:justify-center={!analysisIsReady}
    class:pt-16={analysisIsReady}
  >
    {#if show}
      <div class="w-full max-w-7xl md:max-w-4xl text-center" transition:blurFly>
        {#if !hideIntro}
          <h1 class="mb-4 text-4xl font-bold tracking-tight md:text-7xl">
            Hi, I'm <span class="text-sky-500 [text-shadow:0_0_8px_rgba(56,189,248,0.7)]">Z1</span>
          </h1>
          <p class="mb-6 text-lg text-gray-300 md:text-xl">
            I'll help you reach your greatest potential in Dota 2.
          </p>
        {/if}
        <Strategy 
          on:hideIntro={handleHideIntro}
          on:analysisLoaded={handleAnalysisLoaded}
        />
      </div>
    {/if}
  </section>
  <Footer  />
</div>