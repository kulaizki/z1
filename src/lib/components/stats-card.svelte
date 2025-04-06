<script lang="ts">
  export let stats: {
    favoriteHeroes: Array<{id: number, name: string, games: number, winRate: number, internalName: string}>;
    roleDistribution: Array<{role: string, percentage: number}>;
    winRate: number;
    totalGames: number;
    avgKda: number;
    avgGpm: number;
    avgXpm: number;
  };

  const HERO_IMG_BASE_URL = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/';
</script>

<div class="rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-600 p-4 md:p-8 shadow-md text-white w-full md:min-w-4xl">
  <h2 class="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-sky-400 [text-shadow:0_0_8px_rgba(56,189,248,0.6)]">Stats</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
    <div>
      <h3 class="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-200">Overview</h3>
      <div class="flex justify-between mb-3 md:mb-4 text-sm md:text-base">
        <span class="text-gray-300">Total Games:</span>
        <span class="font-semibold">{stats.totalGames}</span>
      </div>
      <div class="flex justify-between mb-5 md:mb-6 text-sm md:text-base">
        <span class="text-gray-300">Win Rate:</span>
        <span class="font-semibold {stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}">
          {stats.winRate.toFixed(1)}%
        </span>
      </div>
      
      {#if stats.avgKda != null && stats.avgGpm != null && stats.avgXpm != null}
        <div class="space-y-3 md:space-y-4 mb-5 md:mb-6 text-sm md:text-base">
          <div class="flex justify-between">
            <span class="text-gray-300">Avg KDA:</span>
            <span class="font-semibold">{stats.avgKda.toFixed(2)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Avg GPM:</span>
            <span class="font-semibold">{stats.avgGpm.toFixed(0)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Avg XPM:</span>
            <span class="font-semibold">{stats.avgXpm.toFixed(0)}</span>
          </div>
        </div>
      {/if}
      
      <h3 class="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-200">Role Distribution</h3>
      {#if stats.roleDistribution && stats.roleDistribution.length > 0}
        <div class="space-y-2 md:space-y-3">
          {#each stats.roleDistribution as role}
            <div class="text-sm md:text-base">
              <div class="flex justify-between mb-1">
                <span class="capitalize">{role.role}</span>
                <span>{role.percentage.toFixed(1)}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-1.5 md:h-2">
                <div 
                  class="bg-sky-500 h-1.5 md:h-2 rounded-full" 
                  style="width: {role.percentage}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400 text-sm md:text-base">No role data available</p>
      {/if}
    </div>
    
    <div>
      <h3 class="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-200">Favorite Heroes</h3>
      {#if stats.favoriteHeroes && stats.favoriteHeroes.length > 0}
        <div class="space-y-3 md:space-y-4">
          {#each stats.favoriteHeroes as hero}
            {@const heroImgSrc = `${HERO_IMG_BASE_URL}${hero.internalName}.png`}
            <div class="p-3 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-300 hover:border-sky-400">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center">
                  <img 
                    src={heroImgSrc} 
                    alt={hero.name} 
                    class="w-12 h-7 md:w-16 md:h-9 rounded mr-3 object-contain border border-gray-600"
                    loading="lazy"
                  />
                  <span class="font-medium text-sm md:text-base">{hero.name}</span>
                </div>
                <span class="text-xs md:text-sm text-gray-400">{hero.games} games</span>
              </div>
              <div class="flex justify-between items-center mt-1 pl-15 md:pl-19">
                <div class="w-3/4 bg-gray-700 rounded-full h-1.5">
                  <div 
                    class={`h-1.5 rounded-full ${hero.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                    style="width: {hero.winRate}%"
                  ></div>
                </div>
                <span class="text-xs md:text-sm {hero.winRate >= 50 ? 'text-green-400' : 'text-red-400'} ml-2">
                  {hero.winRate.toFixed(1)}%
                </span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400 text-sm md:text-base">No hero data available</p>
      {/if}
    </div>
  </div>
</div>
