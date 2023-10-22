/**
 * Functions to create data structures and read and transform states for rooms.
 */

export function createRoom(x, y, width, height) {
    return {
        x: x,
        y: y,
        width: width,
        height: height,
    }
}

export function overlapping(roomA, roomB) {
    return roomA.x < roomB.x + roomB.width
        && roomA.x + roomA.width > roomB.x
        && roomA.y < roomB.y + roomB.height
        && roomA.height + roomA.y > roomB.y;
}

// Sort rooms by their starting vector (upper left corner).
export function sortRooms(rooms) {
    rooms.sort((a, b) => {
        return (a.x + a.y > b.x + b.y) ? 1 : -1;
    });
    return rooms;
}

export function getCenter(room) {
    return {
        x: room.x + Math.floor(room.width / 2),
        y: room.y + Math.floor(room.height / 2)
    };
}

export function getNorthExit(room) {
    return {
        x: room.x + Math.floor(room.width / 2),
        y: room.y
    };
}

export function getSouthExit(room) {
    return {
        x: room.x + Math.floor(room.width / 2),
        y: room.y + room.height
    };
}

export function getEastExit(room) {
    return {
        x: room.x + room.width,
        y: room.y + Math.floor(room.height / 2)
    };
}

export function getWestExit(room) {
    return {
        x: room.x,
        y: room.y + Math.floor(room.height / 2)
    };
}
