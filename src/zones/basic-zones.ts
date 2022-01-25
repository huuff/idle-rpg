import { createZone, Zone } from "./zone";
import { createStage, Stage } from "./stage";
import basicZonesJson from "./basic-zones.json";
import {EnemySpecification} from "./enemy-distribution";
import { basicSpecies, isBasicSpeciesName } from "@/creatures/basic-species";
import {mapValues} from "lodash";

type ZoneName = keyof typeof basicZonesJson;
type JsonStageEnemy = {
  species: string;
  averageLevel: number;
  frequency: number;
};
type JsonStage = {
  steps: number;
  enemies: JsonStageEnemy[];
}
type JsonZone = {
  name: string;
  stages: JsonStage[];
}

type JsonType = {[zoneName in ZoneName]: JsonZone};
type BasicZones = {[zoneName in ZoneName]: Zone}

function convertJsonEnemy(json: JsonStageEnemy): EnemySpecification {
  const species = json.species;
  if (!isBasicSpeciesName(species)) {
    throw new Error(`${json.species} is not a known species!`)
  }

  return {
    species: basicSpecies[species],
    averageLevel: json.averageLevel,
    frequency: json.frequency
  }
}

function convertJsonStage(json: JsonStage): Stage {
  const enemies = json.enemies.map(convertJsonEnemy);

  return createStage({ enemies, steps: json.steps});
}

function convertJsonZone(json: JsonZone): Zone {
  const stages = json.stages.map(convertJsonStage);

  return createZone({
    name: json.name,
    stages,
  });
}

function loadJson(json: JsonType): BasicZones {
  return mapValues(json, convertJsonZone);
}

export const basicZones: BasicZones = loadJson(basicZonesJson);