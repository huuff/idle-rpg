import { Species } from "./species";
import basicSpeciesJson from "./basic-species.json";

type BasicSpeciesName = keyof typeof basicSpeciesJson;

export type BasicSpecies = {[name in BasicSpeciesName]: Species };

export const basicSpecies: BasicSpecies = basicSpeciesJson as BasicSpecies;

export function isBasicSpeciesName(speciesName: string): speciesName is BasicSpeciesName {
  return speciesName in basicSpecies;
}
