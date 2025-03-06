import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import heroes from '$lib/data/heroes';
import type { Hero } from '$types/Hero';

const ROLES = ['carry', 'mid', 'offlane', 'support', 'hard support'];

const HERO_ROLES = {
  'Anti-Mage': 'carry',
  'Drow Ranger': 'carry',
  'Juggernaut': 'carry',
  'Morphling': 'carry',
  'Phantom Lancer': 'carry',
  'Spectre': 'carry',
  'Faceless Void': 'carry',
  'Phantom Assassin': 'carry',
  'Luna': 'carry',
  'Lifestealer': 'carry',
  'Slark': 'carry',
  'Medusa': 'carry',
  'Terrorblade': 'carry',
  'Arc Warden': 'carry',
  'Monkey King': 'carry',
  
  'Shadow Fiend': 'mid',
  'Storm Spirit': 'mid',
  'Zeus': 'mid',
  'Lina': 'mid',
  'Queen of Pain': 'mid',
  'Templar Assassin': 'mid',
  'Invoker': 'mid',
  'Outworld Destroyer': 'mid',
  'Ember Spirit': 'mid',
  'Void Spirit': 'mid',
  'Puck': 'mid',
  'Tinker': 'mid',
  
  'Axe': 'offlane',
  'Earthshaker': 'offlane',
  'Sand King': 'offlane',
  'Slardar': 'offlane',
  'Tidehunter': 'offlane',
  'Bristleback': 'offlane',
  'Centaur Warrunner': 'offlane',
  'Magnus': 'offlane',
  'Timbersaw': 'offlane',
  'Legion Commander': 'offlane',
  'Underlord': 'offlane',
  'Mars': 'offlane',
  
  // Supports
  'Crystal Maiden': 'hard support',
  'Witch Doctor': 'support',
  'Lich': 'hard support',
  'Warlock': 'hard support',
  'Dazzle': 'hard support',
  'Jakiro': 'hard support',
  'Ancient Apparition': 'support',
  'Shadow Demon': 'support',
  'Rubick': 'support',
  'Disruptor': 'support',
  'Keeper of the Light': 'hard support',
  'Io': 'support',
  'Lion': 'support',
  'Shadow Shaman': 'hard support',
  'Ogre Magi': 'support',
  'Vengeful Spirit': 'support',
  'Dark Willow': 'support',
  'Grimstroke': 'support',
  'Snapfire': 'support',
  'Oracle': 'hard support',
  'Winter Wyvern': 'hard support'
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