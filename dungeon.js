const DEBUG = false;
 
var Square = {
    FILLED: 1,
    EMPTY: 0,
    WALL_NORTH: 2,
    WALL_SOUTH: 3,
    WALL_EAST: 4,
    WALL_WEST: 5,
    ISOLATED_FILLED: 6,
    CORNER_BOTTOMRIGHT: 7,
    CORNER_BOTTOMLEFT: 8,
    CORNER_TOPRIGHT: 9,
    CORNER_TOPLEFT: 10,
    SURROUNDED_BUTEAST: 11,
    SURROUDNED_BUTWEST: 12
};
 
var Color = {
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
 
function fillCanvas(context) {
    context.beginPath();
    context.rect(0, 0, width, height);
    context.fillStyle = Color.ROCK;
    context.fill();
}
 
function createRooms(map, numRoomTries, rooms) {
    for (var i = 0; i < numRoomTries; i++) {
        var size = rand(1, 2) * 2 + 1;
        var width = size;
        var height = size;
        var rectangularity = rand(0, 1 + Math.floor(size / 2)) * 2;
        if (rand(1, 2) === 2) {
            width += rectangularity;
        } else {
            height += rectangularity;
        }
 
        var x = rand(Math.floor((map.length() - width) / 2)) * 2 + 1;
        var y = rand(Math.floor((map.rowLength() - height) / 2)) * 2 + 1;
 
        var room = new Room(x, y, width, height);
        var overlaps = false;
        for (var roomadded of rooms) {
            if (room.overlaps(roomadded)) {
                overlaps = true;
                break;
            }
        }
 
        if (overlaps) {
            continue;
        }
 
        rooms.push(room);
 
        if (rooms.length >= maxRooms) {
            break;
        }
    }
 
    log("Generated " + rooms.length + " rooms.");
}
 
function sortRooms(rooms) {
    rooms.sort(function (a, b) {
        return (a.x + a.y > b.x + b.y)? 1 : -1;
    });
}
 
function chooseBossRoom(map, rooms) {
    var center = rooms[rooms.length - 1].getCenter();
    map.setBossPos(center.x, center.y);
}
 
function makePaths(map, rooms) {
    for (var i = 0; i < rooms.length - 1; i++) {
        makePath(map, rooms[i], rooms[i+1]);
    }
}
 
function makePath(map, first, second) {
    // Check the distance to the next room
    var horizontalDistance = second.x - first.x;
    var verticalDistance = second.y - first.y;
 
    // If horizontal distance is larger, we're moving vertically and otherwise.
    var startHorizontal = true;
    if (horizontalDistance < verticalDistance) {
        var way = first.getSouthExit();
        var entryPoint = second.getNorthExit();
        startHorizontal = false;
    } else {
        var way = first.getEastExit();
        var entryPoint = second.getWestExit();
    }
 
    log("Desde " + way.x + "," + way.y + " a " + entryPoint.x + "," + entryPoint.y + ".");
 
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
 
function advancePathEast(map, entry, destination) {
    while (entry.x <= destination.x) {
        map.setSquare(entry.x, entry.y, Square.EMPTY);
        log("Vaciando: " + entry.x + "," + entry.y);
        entry.x++;
    }
}
 
function advancePathWest(map, entry, destination) {
    while (entry.x >= destination.x) {
        map.setSquare(entry.x, entry.y, Square.EMPTY);
        log("Vaciando: " + entry.x + "," + entry.y);
        entry.x--;
    }
}
 
function advancePathNorth(map, entry, destination) {
    while (entry.y <= destination.y) {
        map.setSquare(entry.x, entry.y, Square.EMPTY);
        log("Vaciando: " + entry.x + "," + entry.y);
        entry.y++;
    }
}
 
function advancePathSouth(map, entry, destination) {
    while (entry.y >= destination.y) {
        map.setSquare(entry.x, entry.y, Square.EMPTY);
        log("Vaciando: " + entry.x + "," + entry.y);
        entry.y--;
    }
}

function setSquareInMap(map, x, y, square, change) {
    map.setSquare(x, y, Square.EMPTY);
    log("Vaciando: " + x + "," + y);
    entry += change;
}
 
function putRoomsInMap(map, rooms) {
    for (var room of rooms) {
        for (var i = room.x; i < room.x + room.width; i++) {
            for (var j = room.y; j < room.y + room.height; j++) {
                map.setSquare(i, j, Square.EMPTY);
            }
        }
    }
}
 
function chooseWalls(map, rooms) {
    for (var x = 0; x < map.length(); x++) {
        for (var y = 0; y < map.rowLength(); y++) {
            var northwest = map.getSquare(x-1, y-1);
            var west = map.getSquare(x-1, y);
            var north = map.getSquare(x, y-1);
            var northeast = map.getSquare(x+1, y-1);
            var east = map.getSquare(x+1, y);
            var southwest = map.getSquare(x-1, y+1);
            var south = map.getSquare(x, y+1);
            var southeast = map.getSquare(x+1, y+1);
        }
    }
}
 
// Renders the grid on the canvas.
function renderCanvas(context, map, squareSize, rooms) {
    for (var i = 0; i < map.length(); i++) {
        for (var j = 0; j < map.rowLength(); j++) {
            context.beginPath();
            context.rect(i * squareSize, j * squareSize, squareSize, squareSize);
            var color;
            var square = map.getSquare(i, j);
            if (square === Square.FILLED) {
                color = Color.ROCK;
            } else if (square === Square.EMPTY) {
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
 
    var bossPos = map.getBossPos();
    context.beginPath();
    context.arc(bossPos.x * squareSize - squareSize / 2, bossPos.y * squareSize - squareSize / 2, squareSize / 4, 0, 2 * Math.PI, false);
    context.fillStyle = '#F22';
    context.fill();
}
 
// Just for debugging purposes
function markRooms(rooms, context) {
    var i = 1;
    for (var room of rooms) {
        context.font = "32px Arial";
        context.fillStyle = "#000";
        context.fillText(i.toString(), (room.x + room.width / 2) * squareSize, (room.y + room.height / 2) * squareSize);
        i++;
    }
}
 
// Define floor boundaries
var squareSize = 32;
var width = 25 * squareSize;
var height = 20 * squareSize;
var numRoomTries = 500;
var maxRooms = 10;
 
// Create the array with the square info.
var map = new Floor(width / squareSize, height / squareSize);
log("Created map in width " + width + " and height " + height + " with squares of size " + squareSize + ". Entries per row: " + map.length());
var rooms = [];
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
 
// Get everything done
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