/**
 * Helper functions for working with stats array
 */

export interface StatItem {
  key: string;
  value: string | number;
}

/**
 * Get a specific stat value by key
 * @param stats - Array of stat objects
 * @param key - The stat key to find
 * @param defaultValue - Default value if stat not found
 * @returns The stat value or default value
 */
export function getStat(stats: StatItem[] | undefined, key: string, defaultValue: string | number = 0): string | number {
  if (!stats || !Array.isArray(stats)) {
    return defaultValue;
  }
  
  const stat = stats.find(s => s.key === key);
  return stat?.value ?? defaultValue;
}

/**
 * Convert stats array to object for easier access
 * @param stats - Array of stat objects
 * @returns Object with keys as stat names and values as stat values
 */
export function statsToObject(stats: StatItem[] | undefined): Record<string, string | number> {
  if (!stats || !Array.isArray(stats)) {
    return {};
  }
  
  return stats.reduce((acc, stat) => {
    acc[stat.key] = stat.value;
    return acc;
  }, {} as Record<string, string | number>);
}

/**
 * Create stats array from object
 * @param statsObject - Object with stat keys and values
 * @returns Array of stat objects
 */
export function objectToStats(statsObject: Record<string, string | number>): StatItem[] {
  return Object.entries(statsObject).map(([key, value]) => ({ key, value }));
}

/**
 * Get multiple stats at once
 * @param stats - Array of stat objects
 * @param keys - Array of keys to retrieve
 * @param defaults - Default values for each key
 * @returns Object with requested stats
 */
export function getMultipleStats(
  stats: StatItem[] | undefined, 
  keys: string[], 
  defaults: Record<string, string | number> = {}
): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  
  keys.forEach(key => {
    result[key] = getStat(stats, key, defaults[key] || 0);
  });
  
  return result;
}

/**
 * Add or update a stat in the stats array
 * @param stats - Current stats array
 * @param key - Stat key
 * @param value - Stat value
 * @returns Updated stats array
 */
export function updateStat(stats: StatItem[], key: string, value: string | number): StatItem[] {
  const existingIndex = stats.findIndex(s => s.key === key);
  
  if (existingIndex >= 0) {
    // Update existing stat
    stats[existingIndex].value = value;
  } else {
    // Add new stat
    stats.push({ key, value });
  }
  
  return stats;
}

/**
 * Remove a stat from the stats array
 * @param stats - Current stats array
 * @param key - Stat key to remove
 * @returns Updated stats array
 */
export function removeStat(stats: StatItem[], key: string): StatItem[] {
  return stats.filter(s => s.key !== key);
} 