export interface StatsInput {
  maxHealth: number;
  strength: number;
  agility: number;
}

export class Stats {
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
    return new Stats({
      maxHealth: this._maxHealth + augend._maxHealth,
      strength: this._strength + augend._strength,
      agility: this._agility + augend._agility
    });
  }

  public times(factor: number): Stats {
    return new Stats({
      maxHealth: this._maxHealth * factor,
      strength: this._strength * factor,
      agility: this._agility * factor,
    });
  }
}

export const zeroStats: Stats = new Stats({
  maxHealth: 0,
  strength: 0,
  agility: 0,
});
