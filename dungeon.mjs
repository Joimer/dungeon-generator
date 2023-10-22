import { rand } from "./random.mjs"
import {
    createRoom, overlapping, getEastExit,
    getNorthExit, getSouthExit, getWestExit
} from "./room.mjs"
import { setSquare, isEmpty } from "./floor.mjs"
import { createSquare } from "./square.mjs"
import { SquareType, isSurrounded } from "./square.mjs"

export function randomSize() {
    const size = rand(1, 2) * 2 + 1;
    let width = size;
    let height = size;
    const rectangularity = rand(0, 1 + Math.floor(size / 2)) * 2;
    if (rand(1, 2) === 2) {
        width += rectangularity;
    } else {
        height += rectangularity;
    }

    return [width, height]
}

// Creates an array of Room objects that contain the information of non-overlapping rooms in the floor.
export function createRooms(map, numRoomTries, maxRooms) {
    const rooms = [];

    for (let i = 0; i < numRoomTries; i++) {
        const [width, height] = randomSize();

        // Choose upper left corner randomly.
        const x = rand(Math.floor((map.length - width) / 2)) * 2 + 1;
        const y = rand(Math.floor((map[x].length - height) / 2)) * 2 + 1;
 
        // Create the room with the specified start vector, width and height.
        // After that, iterate previously created rooms to find if it's overlapping with anything.
        const room = createRoom(x, y, width, height);
        let overlaps = false;
        for (const roomadded of rooms) {
            if (overlapping(room, roomadded)) {
                overlaps = true;
                break;
            }
        }
 
        if (overlaps) {
            continue;
        }
 
        // Room is ready. If we have enough rooms, we are done here before the total number of attempts.
        rooms.push(room);

        if (rooms.length >= maxRooms) {
            break;
        }
    }

    return rooms;
}

// For every room, create a path to the next room.
// This connects all rooms in single paths from one to another.
export function carvePaths(map, rooms) {
    for (let i = 0; i < rooms.length - 1; i++) {
        makePath(map, rooms[i], rooms[i+1]);
    }
}

// Given two rooms, connect them through a single path.
function makePath(map, first, second) {
    // Check the distance to the next room
    const horizontalDistance = second.x - first.x;
    const verticalDistance = second.y - first.y;
 
    // If horizontal distance is larger, we're moving vertically and otherwise.
    let startHorizontal = true;
    let way;
    let entryPoint;
    if (horizontalDistance < verticalDistance) {
        way = getSouthExit(first);
        entryPoint = getNorthExit(second);
        startHorizontal = false;
    } else {
        way = getEastExit(first);
        entryPoint = getWestExit(second);
    }

    // Decide in which way to advance the path, clearing it to reach the next room. 
    if (startHorizontal) {
        if (way.x <= entryPoint.x) {
            advancePathEast(map, way, entryPoint);
        } else {
            advancePathWest(map, way, entryPoint);
        }
        if (way.y <= entryPoint.y) {
            advancePathNorth(map, way, entryPoint);
        } else {
            advancePathSouth(map, way, entryPoint);
        }
    } else {
        if (way.y <= entryPoint.y) {
            advancePathNorth(map, way, entryPoint);
        } else {
            advancePathSouth(map, way, entryPoint);
        }
        if (way.x <= entryPoint.x) {
            advancePathEast(map, way, entryPoint);
        } else {
            advancePathWest(map, way, entryPoint);
        }
    }
}

// Advances the path to the east, emptying squares until it finds the next room.
function advancePathEast(map, entry, destination) {
    while (entry.x <= destination.x) {
        carveSquare(map, entry.x, entry.y);
        entry.x++;
    }
}

// Advances the path to the west, emptying squares until it finds the next room. 
function advancePathWest(map, entry, destination) {
    while (entry.x >= destination.x) {
        carveSquare(map, entry.x, entry.y);
        entry.x--;
    }
}

// Advances the path to the north, emptying squares until it finds the next room.
function advancePathNorth(map, entry, destination) {
    while (entry.y <= destination.y) {
        carveSquare(map, entry.x, entry.y);
        entry.y++;
    }
}

// Advances the path to the south, emptying squares until it finds the next room.
function advancePathSouth(map, entry, destination) {
    while (entry.y >= destination.y) {
        carveSquare(map, entry.x, entry.y);
        entry.y--;
    }
}

// Sugar to set an empty square on position x,y and also log it if debug is active.
function carveSquare(map, x, y) {
    setSquare(map, x, y, SquareType.EMPTY);

    return map;
}

// Carve the rooms in the map, setting all the squares that a room contain empty.
export function carveRoomsInMap(map, rooms) {
    for (const room of rooms) {
        for (let i = room.x; i < room.x + room.width; i++) {
            for (let j = room.y; j < room.y + room.height; j++) {
                setSquare(map, i, j, SquareType.EMPTY);
            }
        }
    }

    return map;
}

// Pick which squares are walls to rooms or paths.
// This pass is done after rooms and paths are carved to avoid overwriting empty squares.
export function chooseWalls(map) {
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            let type = map[x][y];

            // If the square is carved, nothing to do here.
            if (type === SquareType.EMPTY) {
                continue;
            }

            // Each bit on this integer represents a position adjacent to the current square.
            // See: Square class.
            let mask = 0;

            // Northwest
            if (!isEmpty(map, x-1, y-1)) {
                mask |= 1;
            }

            // North
            if (!isEmpty(map, x, y-1)) {
                mask |= 2;
            }

            // Northeast
            if (!isEmpty(map, x+1, y-1)) {
                mask |= 4;
            }

            // West
            if (!isEmpty(map, x-1, y)) {
                mask |= 8;
            }

            // East
            if (!isEmpty(map, x+1, y)) {
                mask |= 16;
            }

            // Southwest
            if (!isEmpty(map, x-1, y+1)) {
                mask |= 32;
            }

            // South
            if (!isEmpty(map, x, y+1)) {
                mask |= 64;
            }

            // Southeast
            if (!isEmpty(map, x+1, y+1)) {
                mask |= 128;
            }
            const square = createSquare(type, mask);

            // Now, depending on the bits set, we choose the appropriate sprite.
            // (For now, if it's not surrounded, it's a wall)
            if (!isSurrounded(square)) {
                type = SquareType.ISOLATED_FILLED;
            }

            // TODO: We lack the other types now.
            // Re-set the same type or one for wall.
            setSquare(map, x, y, type);
        }
    }
}
