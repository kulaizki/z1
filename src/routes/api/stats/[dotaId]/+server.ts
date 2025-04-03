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
    const heroStatsResponse = await fetch(`https://api.opendota.com/api/players/${dotaId}/heroes`);
    if (!heroStatsResponse.ok) {
      return json({ error: 'Failed to fetch hero stats from OpenDota API' }, { status: 500 });
    }
    const heroStats = await heroStatsResponse.json();
    
    // Fetch total matches
    const wlResponse = await fetch(`https://api.opendota.com/api/players/${dotaId}/wl`);
    if (!wlResponse.ok) {
      return json({ error: 'Failed to fetch win/loss from OpenDota API' }, { status: 500 });
    }
    const wlData = await wlResponse.json();
    
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
    
    return json({
      favoriteHeroes,
      roleDistribution,
      winRate,
      totalGames
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