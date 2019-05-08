class Square {
 
    constructor(type, mask) {
        this.type = type;

        // This integer is gonna be a mask for 8 bits.
        // Each bit represents a position adjacent to the current square.
        // Should the bit be set, that means the specified position is occupied by rock, or basically not walkable ground.
        /**
         * The mask works as follows:
         *  _______________
         * |  1 |  2 |  4  |
         * |---------------|
         * | 8  |  X |  16 |
         * |---------------|
         * | 32 | 64 | 128 |
         * -----------------
         */
        this.mask = mask;
    }

    isIsolated() {
        return this.mask === 0
        || (
            (2 & ~this.mask) !== 0
            && (8 & ~this.mask) !== 0
            && (16 & ~this.mask) !== 0
            && (64 & ~this.mask) !== 0
        );
    }

    isSurrounded() {
        return this.mask === 255;
    }

    onlyAdjacentNorth() {
        return (2 & this.mask) !== 0
            && (1 & ~this.mask) !== 0
            && (4 & ~this.mask) !== 0
            && (8 & ~this.mask) !== 0
            && (16 & ~this.mask) !== 0
            && (64 & ~this.mask) !== 0;
    }

    onlyAdjacentSouth() {
        return (64 & this.mask) !== 0
            && (1 & ~this.mask) !== 0
            && (4 & ~this.mask) !== 0
            && (8 & ~this.mask) !== 0
            && (16 & ~this.mask) !== 0
            && (2 & ~this.mask) !== 0;
    }

    onlyAdjacentEast() {
        return (16 & this.mask) !== 0
            && (1 & ~this.mask) !== 0
            && (4 & ~this.mask) !== 0
            && (8 & ~this.mask) !== 0
            && (2 & ~this.mask) !== 0
            && (64 & ~this.mask) !== 0;
    }

    onlyAdjacentWest() {
        return (8 & this.mask) !== 0
            && (1 & ~this.mask) !== 0
            && (4 & ~this.mask) !== 0
            && (2 & ~this.mask) !== 0
            && (16 & ~this.mask) !== 0
            && (64 & ~this.mask) !== 0;
    }

    wallBorderNorth() {
        return (64 & this.mask) !== 0
            && (1 & ~this.mask) !== 0
            && (2 & ~this.mask) !== 0
            && (4 & ~this.mask) !== 0
            && (8 & this.mask) !== 0
            && (16 & this.mask) !== 0;
    }
}
