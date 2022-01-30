import { Creature } from "@/creatures/creature";
import BattleAreas, { BattleArea } from "./battle-area";
import { extend } from "lodash";
import Skills from "@/skills/skill";

export type StillStatus = {
    in: BattleArea;
}

export type MovingStatus = {
    to: BattleArea;
}

export type BattleStatus = StillStatus | MovingStatus;

export type CreatureWithStatus = {
    status: BattleStatus;
} & Creature;

export type StillCreature = Creature & { status: StillStatus };

function isMoving(status: BattleStatus): status is MovingStatus {
    return "to" in status;
}

function isStill(status: BattleStatus): status is StillStatus {
    return "in" in status;
}

function put(creature: Creature, status: BattleStatus): CreatureWithStatus {
    return extend(creature, { status } );
}

function initialStatus(creature: Creature, areas: BattleArea[]): CreatureWithStatus {
    return Skills.hasInitiative(creature)
    ? put(creature, { in: BattleAreas.find(areas, "rearguard")})
    : put(creature, { in: BattleAreas.find(areas, "front")})
    ;
}

export default {
    put,
    isMoving,
    isStill,
    initialStatus,
}