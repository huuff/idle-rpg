// Separated into an interface and implementation because
// Vue's `reactive` of a `StatsImpl` only returns a type
// that's only compatible on the public properties, so, a
// Stats

export interface Stats {
  maxHealth: number;
  strength: number;
  agility: number;
  challenge: number;
  plus(augend: Stats): Stats;
  times(factor: number): Stats;
}

export class StatsImpl implements Stats {
  private readonly _maxHealth: number;
  private readonly _strength: number;
  private readonly _agility: number;
  
  constructor(stats: {
    maxHealth: number;
    strength: number;
    agility: number;
  }) {
    this._maxHealth = stats.maxHealth;
    this._strength = stats.strength;
    this._agility = stats.agility;
  }

  public get maxHealth() {
    return Math.round(this._maxHealth);
  }

  public get strength() {
    return Math.round(this._strength);
  }

  public get agility() {
    return Math.round(this._agility);
  }

  public get challenge() {
    return Math.round(
      (this._maxHealth) / 10
      + this._strength
      + this._agility
    );
  }

  public plus(augend: Stats): Stats {
    if (augend instanceof StatsImpl)
      return new StatsImpl({
        maxHealth: this._maxHealth + augend._maxHealth,
        strength: this._strength + augend._strength,
        agility: this._agility + augend._agility
      });
    else
      return this.plus(new StatsImpl(augend));
  }

  public times(factor: number): Stats {
    return new StatsImpl({
      maxHealth: this._maxHealth * factor,
      strength: this._strength * factor,
      agility: this._agility * factor,
    });
  }
}

// Null object pattern
export const zeroStats: Stats = new StatsImpl({
  maxHealth: 0,
  strength: 0,
  agility: 0,
});

export function areZeroStats(stats: Stats) {
  return stats.maxHealth === 0
        && stats.strength === 0
        && stats.agility === 0
        ;
}

export interface CalculableStats {
  baseStats: Stats,
  levelProgression: Stats,
}

export function calculateStats(stats: CalculableStats, level: number) {
  return stats.baseStats.plus(stats.levelProgression.times(level));
}
