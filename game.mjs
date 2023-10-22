import { createRooms, carveRoomsInMap, carvePaths, chooseWalls } from "./dungeon.mjs"
import { createEmptyFloor, pickExit, setSquare, pickStartingPoint, isEmpty } from "./floor.mjs"
import { sortRooms, getCenter } from "./room.mjs"
import { SquareType } from "./square.mjs"
import { createPlayer, experience, Input, PlayerAction } from "./player.mjs"
import { newEnemy, enemyTurnAction } from "./enemy.mjs"
import { attack } from "./battle.mjs"

export function createGame() {
    // Create the floor.
    const [floor, rooms] = createFloor();

    // Create the player.
    const startPos = pickStartingPoint(rooms);
    const player = createPlayer(startPos);

    // Create the enemies.
    const enemies = createEnemies(1, rooms);

    return {
        floorIndex: 1,
        floor: floor,
        rooms: rooms,
        player: player,
        turn: 0,
        enemies: enemies,
    }
}

function enterFloor(game) {
    const [floor, rooms] = createFloor();
    game.floorIndex++;
    game.rooms = rooms;
    game.floor = floor;
    game.enemies = createEnemies(game.floorIndex, rooms);
    const startPos = pickStartingPoint(rooms);
    game.player.pos.x = startPos.x;
    game.player.pos.y = startPos.y;
    if (game.player.hp < game.player.maxHp) {
        game.player.hp += Math.min(Math.ceil(game.player.maxHp / 2), game.player.maxHp - game.player.hp);
    }
}

export function createEnemies(floorIndex, rooms) {
    const enemies = [];
    for (let i = 1; i < rooms.length - 1; i++) {
        const room = rooms[i];
        const enemy = newEnemy(floorIndex, getCenter(room));
        enemies.push(enemy);
    }
    return enemies
}

export function createFloor() {
    const cols = 25;
    const rows = 20;
    const numRoomTries = 500;
    const maxRooms = 10;
    const floor = createEmptyFloor(cols, rows);
    const rooms = sortRooms(createRooms(floor, numRoomTries, maxRooms));
    const exit = pickExit(rooms);
    // Doing by reference now, can instead return a new immutable object on each call.
    // That is a bit of overkill considering the method of carving squares one by one, though.
    setSquare(floor, exit.x, exit.y, SquareType.EXIT);
    carveRoomsInMap(floor, rooms);
    carvePaths(floor, rooms);
    chooseWalls(floor);

    return [floor, rooms]
}

export function movement(game, playerInput) {
    const actions = []

    // First check player action.
    if (game.player.hp <= 0) {
        return actions;
    }

    let didMove = false;
    const attemptedPosition = {x: game.player.pos.x, y: game.player.pos.y}
    if (playerInput === Input.UP) {
        attemptedPosition.y -= 1;
        didMove = true;
    }
    if (playerInput === Input.DOWN) {
        attemptedPosition.y += 1;
        didMove = true;
    }
    if (playerInput === Input.LEFT) {
        attemptedPosition.x -= 1;
        didMove = true;
    }
    if (playerInput === Input.RIGHT) {
        attemptedPosition.x += 1;
        didMove = true;
    }
    if (didMove) {
        if (isEmpty(game.floor, attemptedPosition.x, attemptedPosition.y)) {
            let enemyThere = false;
            // TODO: Keep x,y ref to occupied/not by entity instead.
            for (const enemy of game.enemies) {
                if (enemy.hp <= 0) {
                    continue;
                }
                enemyThere = enemy.pos.x === attemptedPosition.x && enemy.pos.y === attemptedPosition.y
                if (enemyThere) {
                    break;
                }
            }
            if (enemyThere) {
                actions.push({action: PlayerAction.BUMP, value: "an enemy"});
            } else {
                game.player.pos.x = attemptedPosition.x;
                game.player.pos.y = attemptedPosition.y;
                actions.push({action: PlayerAction.MOVE, value: 1});
            }

            // Exit
            // TODO: Actually cache this as a value.
            const exitPos = pickExit(game.rooms);
            if (game.player.pos.x === exitPos.x && game.player.pos.y === exitPos.y) {
                enterFloor(game, game.floorIndex);
                actions.push({action: PlayerAction.FLOOR, value: game.floorIndex});
            }
        } else {
            actions.push({action: PlayerAction.BUMP, value: "a wall"});
        }
    } else if (playerInput === Input.ACTION) {
        const possibleAttacks = [
            {x: game.player.pos.x, y: game.player.pos.y + 1},
            {x: game.player.pos.x, y: game.player.pos.y - 1},
            {x: game.player.pos.x + 1, y: game.player.pos.y},
            {x: game.player.pos.x - 1, y: game.player.pos.y},
            {x: game.player.pos.x - 1, y: game.player.pos.y - 1},
            {x: game.player.pos.x + 1, y: game.player.pos.y + 1},
            {x: game.player.pos.x - 1, y: game.player.pos.y + 1},
            {x: game.player.pos.x + 1, y: game.player.pos.y - 1},
        ]
        let receiver;
        for (const enemy of game.enemies) {
            if (enemy.hp <= 0) {
                continue;
            }
            for (const attackPos of possibleAttacks) {
                if (enemy.pos.x === attackPos.x && enemy.pos.y === attackPos.y) {
                    receiver = enemy;
                    break;
                }
            }
            if (receiver) {
                break;
            }
        }

        if (receiver && receiver.hp && receiver.hp > 0) {
            const damage = attack(game.player, receiver);
            receiver.hp -= damage;
            if (receiver.hp <= 0) {
                const exp = receiver.expYield;
                game.player.exp += exp;
                actions.push({action: PlayerAction.ENEMY_DEFEAT, value: damage, target: receiver, value2: exp});
                if (game.player.exp >= experience(game.player.level + 1)) {
                    game.player.level++;
                    game.player.maxHp += 5;
                    game.player.hp = game.player.maxHp;
                    actions.push({action: PlayerAction.LEVELUP, value: game.player.level});
                }
            } else {
                actions.push({action: PlayerAction.ATTACK, value: damage, target: receiver});
            }
        } else {
            actions.push({action: PlayerAction.SWING});
        }
    }

    // Enemy actions.
    for (const enemy of game.enemies) {
        if (enemy.hp <= 0) {
            continue;
        }
        const action = enemyTurnAction(game, enemy)
        actions.push(action);
    }

    game.turn++;

    // Recover 1 hp.
    if (game.turn % 5 === 0 && game.player.hp < game.player.maxHp) {
        game.player.hp++;
    }

    return actions;
}
