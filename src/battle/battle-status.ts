import { Creature } from "@/creatures/creature";
import BattleAreas, { BattleArea } from "./battle-area";
import { extend } from "lodash";
import Skills from "@/skills/skill";
import { chooseRandom } from "@/util/random";
import { last } from "lodash";

export type StillStatus = {
    type: "still";
    in: BattleArea;
}

export type MovingStatus = {
    type: "moving";
    from: BattleArea;
    to: BattleArea;
    steps: number;
}

export type BattleStatus = StillStatus | MovingStatus;

function match<T>(status: BattleStatus,
    onStill: (still: StillStatus) => T,
    onMoving: (moving: MovingStatus) => T,
) {
    if (status.type === "still") {
        return onStill(status);
    } else if (status.type === "moving") {
        return onMoving(status);
    } else {
        throw new Error(`Status ${JSON.stringify(status)} not matched in BattleStatus.match`)
    }
}

export type CreatureWithStatus = {
    status: BattleStatus;
} & Creature;

export type StillCreature = Creature & { status: StillStatus };
export type MovingCreature = Creature & { status: MovingStatus };

function isMoving(status: BattleStatus): status is MovingStatus {
    return status.type === "moving";
}

function isStill(status: BattleStatus): status is StillStatus {
    return status.type === "still";
}

function setup<T extends BattleStatus>(creature: Creature, status: T) {
    return extend(creature, { status });
}

type SetupTeams = {
    goodGuys: StillCreature[],
    badGuys: StillCreature[],
}
function setupTeams(goodGuys: Creature[], badGuys: Creature[], areas: BattleArea[]): SetupTeams {
    // First, choose a random area to be the frontguard
    const front = chooseRandom(areas);

    // Setup everyone without initiative in the front
    const frontGoodGuys: StillCreature[] = goodGuys
        .filter(c => !Skills.hasInitiative(c))
        .map(c => setup(c, { type: "still", in: front }))
    const frontBadGuys: StillCreature[] = badGuys
        .filter(c => !Skills.hasInitiative(c))
        .map(c => setup(c, { type: "still", in: front }))

    // Choose the furthest away area for the guys in the rearguard
    const areasByDistanceToFront = areas
        .filter(a => a.name !== front.name)
        .map<[BattleArea, number]>(a => [a, BattleAreas.distance(a.coordinates, front.coordinates)])
        .sort(([_1, dist1], [_2, dist2]) => dist1 - dist2);

    const firstRearguard = last(areasByDistanceToFront)![0];
    const rearguardGoodGuys: StillCreature[] = goodGuys
        .filter(Skills.hasInitiative)
        .map(c => setup(c, { type: "still", in: firstRearguard }))

    // If there are more rearguards, use another for the other team,
    // else just use the same
    const secondRearguard = areasByDistanceToFront.length > 1
        ? last(areasByDistanceToFront.filter(([a, _]) => a.name !== firstRearguard.name))![0]
        : firstRearguard;
    const rearguardBadGuys: StillCreature[] = badGuys
        .filter(Skills.hasInitiative)
        .map(c => setup(c, { type: "still", in: secondRearguard }))

    return {
        goodGuys: frontGoodGuys.concat(rearguardGoodGuys),
        badGuys: frontBadGuys.concat(rearguardBadGuys)
    }
}

function currentLocation(creature: CreatureWithStatus): BattleArea {
    return match(creature.status,
        (still) => still.in,
        (moving) => moving.from
    );
}

export default {
    isMoving,
    isStill,
    setupTeams,
    match,
    currentLocation,
}