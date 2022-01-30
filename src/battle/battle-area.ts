import { Move } from "./battle-action";

export type BattleArea = {
    name: string;
    type: "front" | "rearguard";
}

// Find an area of the specified type or just return the first one,
// which is a sensible default: If a creature can't be where they want
// just put them anywhere
function find(areas: BattleArea[], type: BattleArea["type"]): BattleArea {
    return areas.find(a => a.type === type) ?? areas[0];
}

function possibleMoves(currentArea: BattleArea, allAreas: BattleArea[]): Move[] {
    return allAreas.filter(a => a.name !== currentArea.name)
        .map(a => ({
            type: "move",
            to: a,
        }))
}

export default {
    find,
    possibleMoves,
}