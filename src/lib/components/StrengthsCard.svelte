<script lang="ts">
  export let strengths: Array<{title: string, description: string}>;
</script>

<div class="rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-600 p-8 shadow-md text-white w-full md:min-w-4xl">
  <h2 class="text-3xl font-extrabold mb-6 text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.6)]">Player Strengths</h2>
  
  <div class="grid grid-cols-1 gap-4">
    {#if strengths && strengths.length > 0}
      {#each strengths as strength}
        <div class="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
          <div class="flex items-start gap-3">
            <div class="mt-1 text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-green-300 mb-1">{strength.title}</h3>
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