import { SquareType } from "./square.mjs"
import { getCenter } from "./room.mjs"

export function createEmptyFloor(width, height) {
    const floor = [];
    for (let i = 0; i < width; i++) {
        floor.push([]);
        for (let j = 0; j < height; j++) {
            floor[i].push(SquareType.FILLED);
        }
    }

    return floor;
}

export function isEmpty(map, x, y) {
    const square = getSquare(map, x, y);
    return square === SquareType.EMPTY;
}

export function isAdjacent(map, posA, posB, reach) {
    //if (reach > 1) {
        // Check here that there is no wall in between.
        //map;
    //}
    return Math.abs(posA.x - posB.x) <= reach && Math.abs(posA.y - posB.y) <= reach
}

export function isEdge(map, x, y) {
    return x === 0 || x === map.length -1 || y === 0 || y === map[x].length -1;
}

export function getSquare(map, x, y) {
    if (typeof map[x] === 'undefined' || typeof map[x][y] === 'undefined') {
        return SquareType.OUT_OF_BOUNDS;
    }
    return map[x][y];
}

export function setSquare(map, x, y, squareType) {
    // This shouldn't happen, but:
    // If a square is empty on an edge, we fill it,
    // so there's a filled square on all the edges.
    if (isEdge(map, x, y)) {
        squareType = squareType === SquareType.EMPTY ? SquareType.FILLED : squareType;
    }
    map[x][y] = squareType;
}

/**
 * The room farthest away from the starting point is chosen as the exit room.
 * This is agnostic to the ordering process itself, so the process may change.
 * The current behaviour now is most likely the room more to the bottom right.
 */
export function pickExit(rooms) {
    return getCenter(rooms[rooms.length - 1]);
}

export function pickStartingPoint(rooms) {
    return getCenter(rooms[0]);
}
