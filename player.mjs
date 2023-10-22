export const Input = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    ACTION: 4
}

export const PlayerAction = {
    AWAIT: 0,
    MOVE: 1,
    ATTACK: 2,
    BUMP: 3,
    ENEMY_DEFEAT: 4,
    DEAD: 5,
    SWING: 6,
    FLOOR: 7,
    LEVELUP: 8,
}

export function createPlayer(pos) {
    return {
        hp: 100,
        maxHp: 100,
        pos: pos,
        exp: 0,
        level: 1,
        atk: 5,
        def: 1,
        dex: 1,
        int: 1,
        spe: 1,
        reach: 1
    }
}

export function experience(level) {
    if (level <= 1) {
        return 0;
    }

    return 50 / 3 * (Math.pow(level, 3) - (6 * Math.pow(level, 2)) + (17 * level) - 12);
}
