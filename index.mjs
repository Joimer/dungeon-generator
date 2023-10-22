
import { SquareSize } from "./config.mjs"
import { renderFrame } from "./canvas.mjs"
import { Input, PlayerAction } from "./player.mjs"
import { createGame, movement } from "./game.mjs"
import { EnemyAction } from "./enemy.mjs"

window.DEBUG = false;

const canvas = document.getElementById("canvas");
let game;
const gameLog = [];

// Add listeners.
document.getElementById("generate").onclick = () => {
    generate(canvas);
}

window.addEventListener("keydown", (event) => {
    if (!game) {
        return;
    }
    if (event.code === 'ArrowUp') {
        gameInput(game, Input.UP);
    }
    if (event.code === 'ArrowLeft') {
        gameInput(game, Input.LEFT);
    }
    if (event.code === 'ArrowRight') {
        gameInput(game, Input.RIGHT);
    }
    if (event.code === 'ArrowDown') {
        gameInput(game, Input.DOWN);
    }
    if (event.code === 'KeyZ') {
        gameInput(game, Input.ACTION);
    }
}, true);

document.getElementById("up").onclick = () => {
    if (!game) {
        return;
    }
    gameInput(game, Input.UP);
}

document.getElementById("left").onclick = () => {
    if (!game) {
        return;
    }
    gameInput(game, Input.LEFT);
}

document.getElementById("right").onclick = () => {
    if (!game) {
        return;
    }
    gameInput(game, Input.RIGHT);
}

document.getElementById("down").onclick = () => {
    if (!game) {
        return;
    }
    gameInput(game, Input.DOWN);
}

document.getElementById("action").onclick = () => {
    if (!game) {
        return;
    }
    gameInput(game, Input.ACTION);
}

function generate(canvas) {
    game = createGame();
    renderFrame(canvas, SquareSize, game);
    showGameData(game);
    logAction(0, "Game generated.");
}

function gameInput(game, input) {
    const actions = movement(game, input);
    renderFrame(canvas, SquareSize, game);
    showGameData(game);
    for (const action of actions) {
        if (action.enemy) {
            if (action.action === EnemyAction.ATTACK) {
                logAction(game.turn, `Enemy ${action.enemy.name} attacked you for ${action.value} damage.`)
            }
            if (action.action === EnemyAction.MOVE) {
                logAction(game.turn, `Enemy ${action.enemy.name} has moved ${action.value}.`)
            }
            continue;
        }
        if (action.action === PlayerAction.BUMP) {
            logAction(game.turn, `You bumped into ${action.value}.`);
        }
        if (action.action === PlayerAction.MOVE) {
            logAction(game.turn, `You moved ${action.value}.`);
        }
        if (action.action === PlayerAction.ATTACK) {
            logAction(game.turn, `You attacked an enemy for ${action.value}.`);
        }
        if (action.action === PlayerAction.ENEMY_DEFEAT) {
            logAction(game.turn, `You attacked an enemy for ${action.value} and defeated it! You gained ${action.value2} experience!`);
        }
        if (action.action === PlayerAction.SWING) {
            logAction(game.turn, `You swang your sword at nothing.`);
        }
        if (action.action === PlayerAction.FLOOR) {
            logAction(game.turn, `You entered the floor ${action.value}.`);
        }
        if (action.action === PlayerAction.LEVELUP) {
            logAction(game.turn, `You have advanced to level ${action.value}.`);
        }
    }
    if (game.player.hp === 0) {
        logAction(game.turn, `You are dead.`);
    }
}

function showGameData(game) {
    document.getElementById("hp").innerText = game.player.hp + "/" + game.player.maxHp;
    document.getElementById("lvl").innerText = game.player.level;
    document.getElementById("exp").innerText = game.player.exp;
    document.getElementById("floor").innerText = game.floorIndex;
    document.getElementById("turn").innerText = game.turn;
}

function logAction(turn, action) {
    const date = new Date();
    const hour = ('' + date.getHours()).padStart(2, "0");
    const min = ('' + date.getMinutes()).padStart(2, "0");
    const sec = ('' + date.getSeconds()).padStart(2, "0");
    const text = `[Turn ${turn}][${hour}:${min}:${sec}] ${action}`;
    gameLog.push(text);
    const logElement = document.getElementById("log");
    logElement.innerHTML = gameLog.slice(-25).join("<br />");
}
