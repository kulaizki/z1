import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import heroesData from '$lib/data/heroes';

interface Hero {
  id: number;
  name: string; // localized display name
  internalName: string; // Added for image URLs
}

const ROLES = ['carry', 'mid', 'offlane', 'support', 'hard support'];

// HERO_ROLES uses localized names
const HERO_ROLES = {
  "Abaddon": "hard support",
  "Alchemist": "carry",
  "Axe": "offlane",
  "Beastmaster": "offlane",
  "Brewmaster": "offlane",
  "Bristleback": "offlane",
  "Centaur Warrunner": "offlane",
  "Chaos Knight": "carry",
  "Clockwerk": "support",
  "Dawnbreaker": "offlane",
  "Doom": "offlane",
  "Dragon Knight": "mid",
  "Earth Spirit": "support",
  "Earthshaker": "support",
  "Elder Titan": "support",
  "Huskar": "mid",
  "Io": "support",
  "Kunkka": "mid",
  "Legion Commander": "offlane",
  "Lifestealer": "carry",
  "Lycan": "offlane",
  "Magnus": "offlane",
  "Marci": "support",
  "Mars": "offlane",
  "Night Stalker": "offlane",
  "Omniknight": "hard support",
  "Phoenix": "support",
  "Primal Beast": "offlane",
  "Pudge": "offlane",
  "Sand King": "offlane",
  "Slardar": "offlane",
  "Snapfire": "support",
  "Spirit Breaker": "support",
  "Sven": "carry",
  "Tidehunter": "offlane",
  "Timbersaw": "offlane",
  "Tiny": "mid",
  "Treant Protector": "hard support",
  "Tusk": "support",
  "Underlord": "offlane",
  "Undying": "hard support",
  "Wraith King": "carry",
  "Anti-Mage": "carry",
  "Arc Warden": "carry",
  "Bloodseeker": "carry",
  "Bounty Hunter": "support",
  "Broodmother": "offlane",
  "Clinkz": "carry",
  "Drow Ranger": "carry",
  "Ember Spirit": "mid",
  "Faceless Void": "carry",
  "Gyrocopter": "carry",
  "Hoodwink": "support",
  "Juggernaut": "carry",
  "Lone Druid": "carry",
  "Luna": "carry",
  "Medusa": "carry",
  "Meepo": "carry",
  "Mirana": "support",
  "Monkey King": "carry",
  "Morphling": "carry",
  "Naga Siren": "carry",
  "Nyx Assassin": "support",
  "Pangolier": "offlane",
  "Phantom Assassin": "carry",
  "Phantom Lancer": "carry",
  "Razor": "carry",
  "Riki": "support",
  "Shadow Fiend": "mid",
  "Slark": "carry",
  "Sniper": "carry",
  "Spectre": "carry",
  "Templar Assassin": "mid",
  "Terrorblade": "carry",
  "Troll Warlord": "carry",
  "Ursa": "carry",
  "Vengeful Spirit": "support",
  "Venomancer": "offlane",
  "Viper": "mid",
  "Weaver": "carry",
  "Ancient Apparition": "support",
  "Bane": "support",
  "Batrider": "offlane",
  "Chen": "support",
  "Crystal Maiden": "hard support",
  "Dark Seer": "offlane",
  "Dark Willow": "support",
  "Dazzle": "hard support",
  "Death Prophet": "mid",
  "Disruptor": "support",
  "Enchantress": "support",
  "Enigma": "offlane",
  "Grimstroke": "support",
  "Invoker": "mid",
  "Jakiro": "hard support",
  "Keeper of the Light": "hard support",
  "Leshrac": "mid",
  "Lich": "hard support",
  "Lina": "mid",
  "Lion": "support",
  "Muerta": "carry",
  "Nature's Prophet": "offlane",
  "Necrophos": "offlane",
  "Ogre Magi": "support",
  "Oracle": "hard support",
  "Outworld Destroyer": "mid",
  "Puck": "mid",
  "Pugna": "support",
  "Queen of Pain": "mid",
  "Rubick": "support",
  "Shadow Demon": "support",
  "Shadow Shaman": "hard support",
  "Silencer": "support",
  "Skywrath Mage": "support",
  "Storm Spirit": "mid",
  "Techies": "support",
  "Tinker": "mid",
  "Visage": "offlane",
  "Void Spirit": "mid",
  "Warlock": "hard support",
  "Windranger": "mid",
  "Winter Wyvern": "hard support",
  "Witch Doctor": "support",
  "Zeus": "mid"
};

export const GET: RequestHandler = async ({ params }) => {
  const { dotaId } = params;

  try {
    // Fetch hero stats, win/loss, and recent matches in parallel
    const [heroStatsResponse, wlResponse, recentMatchesResponse] = await Promise.all([
      fetch(`https://api.opendota.com/api/players/${dotaId}/heroes`),
      fetch(`https://api.opendota.com/api/players/${dotaId}/wl`),
      fetch(`https://api.opendota.com/api/players/${dotaId}/recentMatches`)
    ]);

    // Check responses
    if (!heroStatsResponse.ok) {
      return json({ error: 'Failed to fetch hero stats from OpenDota API' }, { status: heroStatsResponse.status });
    }
    if (!wlResponse.ok) {
      return json({ error: 'Failed to fetch win/loss from OpenDota API' }, { status: wlResponse.status });
    }
    if (!recentMatchesResponse.ok) {
      // Log but don't fail the whole request if recent matches fail
      console.warn(`Failed to fetch recent matches for ${dotaId}, status: ${recentMatchesResponse.status}`);
    }

    const heroStats = await heroStatsResponse.json();
    const wlData = await wlResponse.json();
    const recentMatches = recentMatchesResponse.ok ? await recentMatchesResponse.json() : [];
    
    // Create a map from hero ID to the hero object from heroes.ts 
    const heroMap = heroesData.reduce((acc: Record<number, Hero>, hero: Hero) => {
      acc[hero.id] = hero;
      return acc;
    }, {});
    
    // Process favorite heroes data
    const favoriteHeroes = heroStats
      .sort((a: any, b: any) => b.games - a.games)
      .slice(0, 5)
      .map((stat: any) => {
        const hero = heroMap[stat.hero_id];
        const heroDisplayName = hero?.name || 'Unknown Hero'; 
        // Use the internalName from the updated heroes.ts
        const internalNameForImg = hero?.internalName || '';
        
        return {
          id: stat.hero_id,
          name: heroDisplayName,
          internalName: internalNameForImg,
          games: stat.games,
          winRate: stat.games > 0 ? (stat.win / stat.games) * 100 : 0 
        };
      });
    
    // Calculate role distribution (uses localized name from heroMap)
    const roleDistribution = calculateRoleDistribution(heroStats, heroMap);
    
    // Calculate overall win rate
    const totalGames = wlData.win + wlData.lose;
    const winRate = totalGames > 0 ? (wlData.win / totalGames) * 100 : 0;

    // Calculate average KDA, GPM, XPM from recent matches
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalGpm = 0;
    let totalXpm = 0;
    let validMatchesCount = 0;
    const processedRecentMatches: Array<{ kda: number; gpm: number; xpm: number; hero_id: number; player_slot: number; radiant_win: boolean; duration: number; game_mode: number; lobby_type: number; version: number | null; kills: number; deaths: number; assists: number; hero_name: string; internalHeroName: string;}> = [];

    if (Array.isArray(recentMatches)) {
      recentMatches.forEach((match: any) => {
        // Basic check for valid match data
        if (match && typeof match.kills === 'number' && typeof match.deaths === 'number' && typeof match.assists === 'number' && typeof match.gold_per_min === 'number' && typeof match.xp_per_min === 'number') {
          totalKills += match.kills;
          totalDeaths += match.deaths;
          totalAssists += match.assists;
          totalGpm += match.gold_per_min;
          totalXpm += match.xp_per_min;
          validMatchesCount++;

          const hero = heroMap[match.hero_id];
          processedRecentMatches.push({
            kda: match.deaths === 0 ? (match.kills + match.assists) : (match.kills + match.assists) / match.deaths,
            gpm: match.gold_per_min,
            xpm: match.xp_per_min,
            hero_id: match.hero_id,
            player_slot: match.player_slot,
            radiant_win: match.radiant_win,
            duration: match.duration,
            game_mode: match.game_mode,
            lobby_type: match.lobby_type,
            version: match.version,
            kills: match.kills,
            deaths: match.deaths,
            assists: match.assists,
            hero_name: hero?.name || 'Unknown Hero',
            internalHeroName: hero?.internalName || ''
          });
        }
      });
    }

    const avgKda = validMatchesCount > 0 
      ? (totalDeaths === 0 ? (totalKills + totalAssists) : (totalKills + totalAssists) / totalDeaths) 
      : 0;
    const avgGpm = validMatchesCount > 0 ? totalGpm / validMatchesCount : 0;
    const avgXpm = validMatchesCount > 0 ? totalXpm / validMatchesCount : 0;
    
    return json({
      favoriteHeroes,
      roleDistribution,
      winRate,
      totalGames,
      avgKda, 
      avgGpm,
      avgXpm,
      processedRecentMatches: processedRecentMatches.slice(0, 20) // Return last 20 processed matches for graph
    });
    
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return json({ error: 'An error occurred while fetching player stats' }, { status: 500 });
  }
};

// Function signature expects Hero map (matching current heroes.ts)
function calculateRoleDistribution(heroStats: any[], heroMap: Record<number, Hero>) {
  // Initialize role counters
  const roleCounts: Record<string, number> = {};
  ROLES.forEach(role => roleCounts[role] = 0);
  
  let totalGamesWithRoles = 0;
  
  // Count games by role
  heroStats.forEach((stat: any) => {
    const hero = heroMap[stat.hero_id]; 
    const heroDisplayName = hero?.name; // Use correct 'name' property
    
    if (heroDisplayName) {
       const role = HERO_ROLES[heroDisplayName as keyof typeof HERO_ROLES];
      
      if (role) {
        roleCounts[role] += stat.games;
        totalGamesWithRoles += stat.games;
      }
    }
  });
  
  // Convert to percentages
  return ROLES
    .map(role => ({
      role,
      percentage: totalGamesWithRoles > 0 
        ? (roleCounts[role] / totalGamesWithRoles) * 100 
        : 0
    }))
    .sort((a, b) => b.percentage - a.percentage);
}