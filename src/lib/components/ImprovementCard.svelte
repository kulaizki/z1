<script lang="ts">
  export let improvements: Array<{area: string, recommendation: string}>;
</script>

<div class="rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-600 p-8 shadow-md text-white w-full md:min-w-4xl">
  <h2 class="text-3xl font-extrabold mb-6 text-amber-400 [text-shadow:0_0_8px_rgba(251,191,36,0.6)]">Areas for Improvement</h2>
  
  <div class="grid grid-cols-1 gap-4">
    {#if improvements && improvements.length > 0}
      {#each improvements as item}
        <div class="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300">
          <div class="flex items-start gap-3">
            <div class="mt-1 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-amber-300 mb-1">{item.area}</h3>
              <p class="text-gray-300">{item.recommendation}</p>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <p class="text-gray-400">No improvement data available yet</p>
    {/if}
  </div>
</div>