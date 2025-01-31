<script lang="ts">

  let dotaId: string = '';
  let matches: any[] = [];
  let error: string = '';

  async function fetchMatches() {
    try {
      const response = await fetch(`/api/matches/${dotaId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      matches = await response.json();
      error = '';
    } catch (err) {
      error = (err as Error).message;
      matches = [];
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && dotaId.trim()) {
      fetchMatches();
    }
  }
</script>

<div class="flex justify-center gap-6">
  <input
    type="text"
    placeholder="Enter your Dota 2 ID"
    bind:value={dotaId}
    on:keypress={handleKeyPress}
    class="w-72 text-center rounded-full px-4 py-2 text-black"
  />
</div>
{#if error}
  <p class="mt-4 text-red-500">{error}</p>
{/if}
{#if matches.length > 0}
  <div class="mt-6">
    <h2 class="text-2xl font-bold">Recent Matches:</h2>
    <ul class="mt-4">
      {#each matches as match}
        <li class="mb-2">
          Match ID: {match.match_id}, Result: {match.radiant_win ? 'Radiant Victory' : 'Dire Victory'}
        </li>
      {/each}
    </ul>
  </div>
{/if}