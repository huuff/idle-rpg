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

export default {
    find,
}