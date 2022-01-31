import Creatures, { Creature } from "./creature";
import { countByType } from "@/util/count-types";
import mapValues from "lodash/mapValues";

// Numbers creatures so it's easier for the player to understand.
// e.g. if there are 5 creatures they are named Slime 1 to Slime 5
export function renameCreatures(creatures: Creature[]): Creature[] {
  const creaturesByType = countByType(creatures, c => c.name);
  const renamedCreatures = mapValues(creaturesByType, _ => 1);

  return creatures.map(c => Creatures.rename(c, `${c.name} ${renamedCreatures[c.name]++}`));
}

