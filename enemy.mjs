import { isAdjacent } from "./floor.mjs"
import { graphFromMap, Heuristic, astar } from "./astar.mjs"
import { attack } from "./battle.mjs"

const EnemyBehaviour = {
    PURSUE: 0,
    KEEP_DISTANCE: 1,
    FLEE: 2
}

export const EnemyAction = {
    AWAIT: 0,
    MOVE: 1,
    ATTACK: 2,
}

export function newEnemy(floorIndex, pos) {
    return {
        name: 'Rat',
        pos: pos,
        behaviour: EnemyBehaviour.PURSUE,
        reach: 1,
        activeDistance: 10,
        hp: 17 + floorIndex * 3,
        level: floorIndex,
        atk: 1 + floorIndex,
        def: floorIndex,
        spe: 1,
        expYield: 5 * floorIndex,
    }
}

export function enemyTurnAction(game, enemy) {
    if (game.player.hp <= 0) {
        return {enemy: enemy, action: EnemyAction.AWAIT}
    }
    if (isAdjacent(game.floor, game.player.pos, enemy.pos, enemy.reach)) {
        // Attack
        const damage = attack(enemy, game.player);
        game.player.hp -= damage;
        return {enemy: enemy, action: EnemyAction.ATTACK, value: damage}
    }

    // Movement
    const distance = Heuristic.MANHATTAN(enemy.pos, game.player.pos);
    if (distance <= enemy.activeDistance) {
        const graph = graphFromMap(game);
        const path = astar(graph, graph[enemy.pos.x][enemy.pos.y], graph[game.player.pos.x][game.player.pos.y]);
        if (path.length > 0 && path.length <= enemy.activeDistance) {
            const nextPosition = path[0];
            const totalMoved = Math.abs(enemy.pos.x - nextPosition.x) + Math.abs(enemy.pos.y - nextPosition.y);
            enemy.pos.x = nextPosition.x;
            enemy.pos.y = nextPosition.y;
            return {enemy: enemy, action: EnemyAction.MOVE, value: totalMoved}
        }
    }

    return {enemy: enemy, action: EnemyAction.AWAIT}
}
