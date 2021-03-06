import { Move } from "./battle-action";

export type Coordinates = {
    readonly x: number;
    readonly y: number;
}

export type BattleArea = {
    readonly name: string;
    readonly coordinates: Coordinates;
}

function distance(first: Coordinates, second: Coordinates) {
    return Math.round(Math.sqrt(
        Math.pow(second.x - first.x, 2)
        + Math.pow(second.y - first.y, 2)
    ))
}

function possibleMoves(currentArea: BattleArea, allAreas: readonly BattleArea[]): Move[] {
    return allAreas.filter(a => a.name !== currentArea.name)
        .map(a => ({
            type: "move",
            to: a,
        }))
}

export default {
    distance,
    possibleMoves,
}