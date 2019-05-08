const DEBUG = false;

const Color = {
    ROCK: '#A87',
    GROUND: '#FCB',
    WALL: '#CA9'
};
 
function log (m) {
    if (DEBUG) {
        document.getElementById('log').innerHTML += "<br />" + m;
    } else {
        console.log(m);
    }
}

// Fills the canvas with the default background colour.
function fillCanvas(context) {
    context.beginPath();
    context.rect(0, 0, width, height);
    context.fillStyle = Color.ROCK;
    context.fill();
}

// Creates an array of Room objects that contain the information of non-overlapping rooms in the floor.
function createRooms(map, numRoomTries, rooms) {
    for (let i = 0; i < numRoomTries; i++) {
        let size = rand(1, 2) * 2 + 1;
        let width = size;
        let height = size;
        let rectangularity = rand(0, 1 + Math.floor(size / 2)) * 2;
        if (rand(1, 2) === 2) {
            width += rectangularity;
        } else {
            height += rectangularity;
        }
 
        // Choose upper left corner randomly.
        let x = rand(Math.floor((map.length() - width) / 2)) * 2 + 1;
        let y = rand(Math.floor((map.rowLength() - height) / 2)) * 2 + 1;
 
        // Create the room with the specified start vector, width and height.
        // After that, iterate previously created rooms to find if it's overlapping with anything.
        let room = new Room(x, y, width, height);
        let overlaps = false;
        for (var roomadded of rooms) {
            if (room.overlaps(roomadded)) {
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
 
    log("Generated " + rooms.length + " rooms.");
}

// Sort rooms by their starting vector (upper left corner).
function sortRooms(rooms) {
    rooms.sort((a, b) => {
        return (a.x + a.y > b.x + b.y)? 1 : -1;
    });
}
 
 // The room farthest away from the starting point is chosen as the boss room.
 // This is agnostic to the ordering process itself, so the process may change.
 // The current behaviour now is most likely the room more to the bottom right.
function chooseBossRoom(map, rooms) {
    var center = rooms[rooms.length - 1].getCenter();
    map.setBossPos(center.x, center.y);
}

// For every room, create a path to the next room.
// This connects all rooms in single paths from one to another.
function makePaths(map, rooms) {
    for (var i = 0; i < rooms.length - 1; i++) {
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
        way = first.getSouthExit();
        entryPoint = second.getNorthExit();
        startHorizontal = false;
    } else {
        way = first.getEastExit();
        entryPoint = second.getWestExit();
    }

    log("Desde " + way.x + "," + way.y + " a " + entryPoint.x + "," + entryPoint.y + ".");

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
        carveSquare(entry.x, entry.y);
        entry.x++;
    }
}

// Advances the path to the west, emptying squares until it finds the next room. 
function advancePathWest(map, entry, destination) {
    while (entry.x >= destination.x) {
        carveSquare(entry.x, entry.y);
        entry.x--;
    }
}

// Advances the path to the north, emptying squares until it finds the next room.
function advancePathNorth(map, entry, destination) {
    while (entry.y <= destination.y) {
        carveSquare(entry.x, entry.y);
        entry.y++;
    }
}

// Advances the path to the south, emptying squares until it finds the next room.
function advancePathSouth(map, entry, destination) {
    while (entry.y >= destination.y) {
        carveSquare(entry.x, entry.y);
        entry.y--;
    }
}

// Sugar to set an empty square on position x,y and also log it if debug is active.
function carveSquare(x, y) {
    map.setSquare(x, y, SquareType.EMPTY);
    log("Vaciando: " + x + "," + y);
}

// Carve the rooms in the map, setting all the squares that a room contain empty.
function putRoomsInMap(map, rooms) {
    for (var room of rooms) {
        for (var i = room.x; i < room.x + room.width; i++) {
            for (var j = room.y; j < room.y + room.height; j++) {
                map.setSquare(i, j, SquareType.EMPTY);
            }
        }
    }
}

// Pick which squares are walls to rooms or paths.
// This pass is done after rooms and paths are carved to avoid overwriting empty squares.
function chooseWalls(map, rooms) {
    for (let x = 0; x < map.length(); x++) {
        for (let y = 0; y < map.rowLength(); y++) {
            let type = map.getSquare(x, y);

            // If the square is carved, nothing to do here.
            if (type === SquareType.EMPTY) {
                continue;
            }

            // Each bit on this integer represents a position adjacent to the current square.
            // See: Square class.
            let mask = 0;

            // Northwest
            if (!map.isEmpty(x-1, y-1)) {
                mask |= 1;
            }

            // North
            if (!map.isEmpty(x, y-1)) {
                mask |= 2;
            }

            // Northeast
            if (!map.isEmpty(x+1, y-1)) {
                mask |= 4;
            }

            // West
            if (!map.isEmpty(x-1, y)) {
                mask |= 8;
            }

            // East
            if (!map.isEmpty(x+1, y)) {
                mask |= 16;
            }

            // Southwest
            if (!map.isEmpty(x-1, y+1)) {
                mask |= 32;
            }

            // South
            if (!map.isEmpty(x, y+1)) {
                mask |= 64;
            }

            // Southeast
            if (!map.isEmpty(x+1, y+1)) {
                mask |= 128;
            }
            let square = new Square(type, mask);

            // Now, depending on the bits set, we choose the appropriate sprite.
            // (For now, if it's not surrounded, it's a wall)
            if (!square.isSurrounded()) {
                type = SquareType.ISOLATED_FILLED;
            }

            // TODO: We lack the other types now.
            // Re-set the same type or one for wall.
            map.setSquare(x, y, type);
        }
    }
}
 
// Renders the grid on the canvas.
function renderCanvas(context, map, squareSize, rooms) {
    for (let i = 0; i < map.length(); i++) {
        for (let j = 0; j < map.rowLength(); j++) {
            context.beginPath();
            context.rect(i * squareSize, j * squareSize, squareSize, squareSize);
            let color;
            let square = map.getSquare(i, j);
            if (square === SquareType.FILLED) {
                color = Color.ROCK;
            } else if (square === SquareType.EMPTY) {
                color = Color.GROUND;
            } else {
                color = Color.WALL;
            }
            context.fillStyle = color;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();
            context.fillStyle = "#333";
            context.font = "12px Arial";
            context.fillText(i + ',' + j, i * squareSize + 5, j * squareSize + 15);
        }
    }
 
    const bossPos = map.getBossPos();
    context.beginPath();
    context.arc(bossPos.x * squareSize - squareSize / 2, bossPos.y * squareSize - squareSize / 2, squareSize / 4, 0, 2 * Math.PI, false);
    context.fillStyle = '#F22';
    context.fill();
}
 
// Just for debugging purposes
function markRooms(rooms, context) {
    let i = 1;
    for (var room of rooms) {
        context.font = "32px Arial";
        context.fillStyle = "#000";
        context.fillText(i.toString(), (room.x + room.width / 2) * squareSize, (room.y + room.height / 2) * squareSize);
        i++;
    }
}
 
// Define floor boundaries
const squareSize = 32;
const width = 25 * squareSize;
const height = 20 * squareSize;
const numRoomTries = 500;
const maxRooms = 10;
 
// Create the array with the square info.
let map = new Floor(width / squareSize, height / squareSize);
log("Created map in width " + width + " and height " + height + " with squares of size " + squareSize + ". Entries per row: " + map.length());
let rooms = [];
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
 
// Get everything done.
fillCanvas(context);
createRooms(map, numRoomTries, rooms);
sortRooms(rooms);
chooseBossRoom(map, rooms);
putRoomsInMap(map, rooms);
makePaths(map, rooms);
chooseWalls(map, rooms);
renderCanvas(context, map, squareSize, rooms);
markRooms(rooms, context);
log("Seeds: <br/>" + seedStack.join(",<br/>"));