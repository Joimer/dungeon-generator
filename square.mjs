export const SquareType = {
    OUT_OF_BOUNDS: -1,
    EMPTY: 0,
    FILLED: 1,
    ISOLATED_FILLED: 2,
    EXIT: 3,
}

export function createSquare(type, mask) {
    return {
        type: type,
        /**
         * This integer is a 8 bit mask.
         * Each bit represents a position adjacent to the current square.
         * Should the bit be set, that means the specified position is occupied by rock, or otherwise not walkable ground.
         * The mask works as follows:
         *  _______________
         * |  1 |  2 |  4  |
         * |---------------|
         * | 8  |  X |  16 |
         * |---------------|
         * | 32 | 64 | 128 |
         * -----------------
         */
        mask: mask,
    }
}

export function isIsolated(square) {
    return square.mask === 0
    || (
        (2 & ~square.mask) !== 0
        && (8 & ~square.mask) !== 0
        && (16 & ~square.mask) !== 0
        && (64 & ~square.mask) !== 0
    );
}

export function isSurrounded(square) {
    return square.mask === 255;
}

export function onlyAdjacentNorth(square) {
    return (2 & square.mask) !== 0
        && (1 & ~square.mask) !== 0
        && (4 & ~square.mask) !== 0
        && (8 & ~square.mask) !== 0
        && (16 & ~square.mask) !== 0
        && (64 & ~square.mask) !== 0;
}

export function onlyAdjacentSouth(square) {
    return (64 & square.mask) !== 0
        && (1 & ~square.mask) !== 0
        && (4 & ~square.mask) !== 0
        && (8 & ~square.mask) !== 0
        && (16 & ~square.mask) !== 0
        && (2 & ~square.mask) !== 0;
}

export function onlyAdjacentEast(square) {
    return (16 & square.mask) !== 0
        && (1 & ~square.mask) !== 0
        && (4 & ~square.mask) !== 0
        && (8 & ~square.mask) !== 0
        && (2 & ~square.mask) !== 0
        && (64 & ~square.mask) !== 0;
}

export function onlyAdjacentWest(square) {
    return (8 & square.mask) !== 0
        && (1 & ~square.mask) !== 0
        && (4 & ~square.mask) !== 0
        && (2 & ~square.mask) !== 0
        && (16 & ~square.mask) !== 0
        && (64 & ~square.mask) !== 0;
}

export function wallBorderNorth(square) {
    return (64 & square.mask) !== 0
        && (1 & ~square.mask) !== 0
        && (2 & ~square.mask) !== 0
        && (4 & ~square.mask) !== 0
        && (8 & square.mask) !== 0
        && (16 & square.mask) !== 0;
}
