import { Colour } from "./config.mjs"
import { getSquare, pickExit } from "./floor.mjs"
import { SquareType } from "./square.mjs"

function fillCanvasBackground(canvas) {
    const context = canvas.getContext('2d');
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = Colour.ROCK;
    context.fill();
}

function renderGameState(canvas, map, rooms, squareSize, player, enemies) {
    const context = canvas.getContext('2d');
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            context.beginPath();
            context.rect(i * squareSize, j * squareSize, squareSize, squareSize);
            let color;
            let square = getSquare(map, i, j);
            if (square === SquareType.FILLED) {
                color = Colour.ROCK;
            } else if (square === SquareType.EMPTY) {
                color = Colour.GROUND;
            } else {
                color = Colour.WALL;
            }

            // Fills the square background.
            context.fillStyle = color;
            context.fill();

            // Adds the coordinates.
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();
            context.fillStyle = "#333";
            context.font = "12px Arial";
            context.fillText(i + ',' + j, i * squareSize + 5, j * squareSize + 15);
        }
    }

    // Prints a circle on the square of the exit position.
    const exitPos = pickExit(rooms);
    context.beginPath();
    context.arc(exitPos.x * squareSize + squareSize / 2, exitPos.y * squareSize + squareSize / 2, squareSize / 4, 0, 2 * Math.PI, false);
    context.fillStyle = '#F22';
    context.fill();

    // Prints a circle on the player position.
    context.beginPath();
    context.arc(player.pos.x * squareSize + squareSize / 2, player.pos.y * squareSize + squareSize / 2, squareSize / 4, 0, 2 * Math.PI, false);
    context.fillStyle = player.hp > 0 ? '#3F3' : '#000';
    context.fill();

    // Prints a circle for each enemy position.
    for (const enemy of enemies) {
        if (enemy.hp <= 0) {
            continue;
        }
        context.beginPath();
        context.arc(enemy.pos.x * squareSize + squareSize / 2, enemy.pos.y * squareSize + squareSize / 2, squareSize / 4, 0, 2 * Math.PI, false);
        context.fillStyle = '#666';
        context.fill();
    }
}

function markRooms(canvas, rooms, squareSize) {
    const context = canvas.getContext('2d');
    let i = 1;
    for (const room of rooms) {
        context.font = "32px Arial";
        context.fillStyle = "#000";
        context.fillText(i.toString(), (room.x + room.width / 2) * squareSize, (room.y + room.height / 2) * squareSize);
        i++;
    }
}

export function renderFrame(canvas, squareSize, game) {
    const cols = game.floor.length;
    const rows = game.floor[0].length;
    const width = cols * squareSize;
    const height = rows * squareSize;
    canvas.width = width;
    canvas.height = height;
    fillCanvasBackground(canvas);
    renderGameState(canvas, game.floor, game.rooms, squareSize, game.player, game.enemies);
    markRooms(canvas, game.rooms, squareSize);
}
