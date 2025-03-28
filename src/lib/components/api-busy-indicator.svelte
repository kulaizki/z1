<script lang="ts">
  export let waitTime: number = 0;
  export let message: string = "API is currently busy";
</script>

<div class="rounded-lg bg-amber-900 border border-amber-600 p-4 shadow-md text-white w-full max-w-xl mx-auto mb-4">
  <div class="flex items-center gap-3">
    <div class="relative">
      <div class="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center">
        <div class="animate-ping absolute w-6 h-6 rounded-full bg-amber-500 opacity-75"></div>
        <div class="relative w-4 h-4 rounded-full bg-amber-400"></div>
      </div>
    </div>
    <div>
      <h3 class="font-semibold text-amber-200">{message}</h3>
      {#if waitTime > 0}
        <p class="text-sm text-amber-100">
          Estimated wait time: {waitTime} {waitTime === 1 ? 'second' : 'seconds'}
        </p>
      {/if}
    </div>
  </div>
</div>