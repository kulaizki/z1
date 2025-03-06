import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import heroes from '$lib/data/heroes';
import type { Hero } from '$types/Hero';

const ROLES = ['carry', 'mid', 'offlane', 'support', 'hard support'];

const HERO_ROLES = {
  // Strength Heroes
  'Abaddon': 'offlane',
  'Alchemist': 'carry',
  'Axe': 'offlane',
  'Beastmaster': 'offlane',
  'Brewmaster': 'offlane',
  'Bristleback': 'offlane',
  'Centaur Warrunner': 'offlane',
  'Chaos Knight': 'carry',
  'Clockwerk': 'offlane',
  'Dawnbreaker': 'offlane',
  'Doom': 'offlane',
  'Dragon Knight': 'mid',
  'Earth Spirit': 'support',
  'Earthshaker': 'offlane',
  'Elder Titan': 'support',
  'Huskar': 'mid',
  'Io': 'support',
  'Kunkka': 'mid',
  'Legion Commander': 'offlane',
  'Lifestealer': 'carry',
  'Lycan': 'offlane',
  'Magnus': 'offlane',
  'Marci': 'support',
  'Mars': 'offlane',
  'Night Stalker': 'offlane',
  'Omniknight': 'support',
  'Phoenix': 'support',
  'Primal Beast': 'offlane',
  'Pudge': 'offlane',
  'Sand King': 'offlane',
  'Slardar': 'offlane',
  'Snapfire': 'support',
  'Spirit Breaker': 'offlane',
  'Sven': 'carry',
  'Tidehunter': 'offlane',
  'Timbersaw': 'offlane',
  'Tiny': 'mid',
  'Treant Protector': 'support',
  'Tusk': 'support',
  'Underlord': 'offlane',
  'Undying': 'support',
  'Wraith King': 'carry',

  // Agility Heroes
  'Anti-Mage': 'carry',
  'Arc Warden': 'carry',
  'Bloodseeker': 'carry',
  'Bounty Hunter': 'support',
  'Broodmother': 'offlane',
  'Clinkz': 'carry',
  'Drow Ranger': 'carry',
  'Ember Spirit': 'mid',
  'Faceless Void': 'carry',
  'Gyrocopter': 'carry',
  'Hoodwink': 'support',
  'Juggernaut': 'carry',
  'Lone Druid': 'carry',
  'Luna': 'carry',
  'Medusa': 'carry',
  'Meepo': 'carry',
  'Mirana': 'support',
  'Monkey King': 'carry',
  'Morphling': 'carry',
  'Naga Siren': 'carry',
  'Nyx Assassin': 'support',
  'Pangolier': 'offlane',
  'Phantom Assassin': 'carry',
  'Phantom Lancer': 'carry',
  'Razor': 'carry',
  'Riki': 'support',
  'Shadow Fiend': 'mid',
  'Slark': 'carry',
  'Sniper': 'carry',
  'Spectre': 'carry',
  'Templar Assassin': 'mid',
  'Terrorblade': 'carry',
  'Troll Warlord': 'carry',
  'Ursa': 'carry',
  'Vengeful Spirit': 'support',
  'Venomancer': 'offlane',
  'Viper': 'mid',
  'Weaver': 'carry',

  // Intelligence Heroes
  'Ancient Apparition': 'support',
  'Bane': 'support',
  'Batrider': 'offlane',
  'Chen': 'support',
  'Crystal Maiden': 'support',
  'Dark Seer': 'offlane',
  'Dark Willow': 'support',
  'Dazzle': 'support',
  'Death Prophet': 'mid',
  'Disruptor': 'support',
  'Enchantress': 'support',
  'Enigma': 'offlane',
  'Grimstroke': 'support',
  'Invoker': 'mid',
  'Jakiro': 'support',
  'Keeper of the Light': 'support',
  'Leshrac': 'mid',
  'Lich': 'support',
  'Lina': 'mid',
  'Lion': 'support',
  'Muerta': 'carry',
  "Nature's Prophet": 'offlane',
  'Necrophos': 'offlane',
  'Ogre Magi': 'support',
  'Oracle': 'support',
  'Outworld Destroyer': 'mid',
  'Puck': 'mid',
  'Pugna': 'support',
  'Queen of Pain': 'mid',
  'Rubick': 'support',
  'Shadow Demon': 'support',
  'Shadow Shaman': 'support',
  'Silencer': 'support',
  'Skywrath Mage': 'support',
  'Storm Spirit': 'mid',
  'Techies': 'support',
  'Tinker': 'mid',
  'Visage': 'offlane',
  'Void Spirit': 'mid',
  'Warlock': 'support',
  'Windranger': 'mid',
  'Winter Wyvern': 'support',
  'Witch Doctor': 'support',
  'Zeus': 'mid'
};


export const GET: RequestHandler = async ({ params }) => {
  const { dotaId } = params;

  try {
    // Fetch hero statistics
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
    
    const heroMap = heroes.reduce((acc: Record<number, string>, hero: Hero) => {
      acc[hero.id] = hero.name;
      return acc;
    }, {});
    
    // Process favorite heroes data
    const favoriteHeroes = heroStats
      .sort((a: any, b: any) => b.games - a.games)
      .slice(0, 5)
      .map((stat: any) => {
        const heroName = heroMap[stat.hero_id] || 'Unknown Hero';
        return {
          id: stat.hero_id,
          name: heroName,
          games: stat.games,
          winRate: (stat.win / stat.games) * 100
        };
      });
    
    // Calculate role distribution based on most played heroes
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

function calculateRoleDistribution(heroStats: any[], heroMap: Record<number, string>) {
  // Initialize role counters
  const roleCounts: Record<string, number> = {};
  ROLES.forEach(role => roleCounts[role] = 0);
  
  let totalGamesWithRoles = 0;
  
  // Count games by role
  heroStats.forEach((stat: any) => {
    const heroName = heroMap[stat.hero_id];
    const role = HERO_ROLES[heroName as keyof typeof HERO_ROLES];
    
    if (role) {
      roleCounts[role] += stat.games;
      totalGamesWithRoles += stat.games;
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