<script lang="ts">
  export let stats: {
    favoriteHeroes: Array<{id: number, name: string, games: number, winRate: number}>;
    roleDistribution: Array<{role: string, percentage: number}>;
    winRate: number;
    totalGames: number;
  };
</script>

<div class="rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-600 p-8 shadow-md text-white max-w-4xl">
  <h2 class="text-3xl font-extrabold mb-6 text-orange-400">Player Stats</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-xl font-bold mb-4 text-gray-200">Overview</h3>
      <div class="flex justify-between mb-4">
        <span class="text-gray-300">Total Games:</span>
        <span class="font-semibold">{stats.totalGames}</span>
      </div>
      <div class="flex justify-between mb-6">
        <span class="text-gray-300">Win Rate:</span>
        <span class="font-semibold {stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}">
          {stats.winRate.toFixed(1)}%
        </span>
      </div>
      
      <h3 class="text-xl font-bold mb-4 text-gray-200">Role Distribution</h3>
      {#if stats.roleDistribution && stats.roleDistribution.length > 0}
        <div class="space-y-3">
          {#each stats.roleDistribution as role}
            <div>
              <div class="flex justify-between mb-1">
                <span class="capitalize">{role.role}</span>
                <span>{role.percentage.toFixed(1)}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div 
                  class="bg-orange-500 h-2 rounded-full" 
                  style="width: {role.percentage}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400">No role data available</p>
      {/if}
    </div>
    
    <div>
      <h3 class="text-xl font-bold mb-4 text-gray-200">Favorite Heroes</h3>
      {#if stats.favoriteHeroes && stats.favoriteHeroes.length > 0}
        <div class="space-y-4">
          {#each stats.favoriteHeroes as hero}
            <div class="p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div class="flex justify-between">
                <span class="font-medium mr-2">{hero.name}</span>
                <span class="text-sm text-gray-400">{hero.games} games</span>
              </div>
              <div class="flex justify-between items-center mt-1">
                <div class="w-24 bg-gray-700 rounded-full h-1.5">
                  <div 
                    class={`h-1.5 rounded-full ${hero.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                    style="width: {hero.winRate}%"
                  ></div>
                </div>
                <span class="text-sm {hero.winRate >= 50 ? 'text-green-400' : 'text-red-400'}">
                  {hero.winRate.toFixed(1)}%
                </span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400">No hero data available</p>
      {/if}
    </div>
  </div>
</div>
