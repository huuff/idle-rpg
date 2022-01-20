import { Creature } from "./creature";

type CreatureTypeCounter = {[type: string]: number};

// Returns the different types of creatures present
// in the array
function creatureTypes(creatures: Creature[]): string[] {
  return [ ...new Set(creatures.map(c => c.name)) ];
}

// Returns an object whose keys are the types of creatures
// and the values are all `startAt`
function typesToCounter(types: string[], startAt = 0): CreatureTypeCounter {
  const result: CreatureTypeCounter = {};

  for (const type of types) {
    result[type] = startAt;
  }

  return result;
}

function countCreaturesByType(creatures: Creature[]): CreatureTypeCounter {
  const result = typesToCounter(creatureTypes(creatures));
  
  creatures.forEach(c => result[c.name]++);

  return result;
}

// Numbers creatures so it's easier for the player to understand.
// e.g. if there are 5 creatures they are named Slime 1 to Slime 5
export function renameCreatures(creatures: Creature[]): Creature[] {
  const creaturesByType = countCreaturesByType(creatures);
  const renamedCreatures = typesToCounter(creatureTypes(creatures), 1);

  for (const creature of creatures) {
    if (creaturesByType[creature.name] > 1) {
      creature.name = `${creature.name} ${renamedCreatures[creature.name]++}`
    }
  }

  return creatures;
}

