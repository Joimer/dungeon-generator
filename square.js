var Square = (function() {
 
    function Square(type, mask) {
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
 
    Square.prototype.isIsolated = function () {
        return this.mask === 0
        || (
            (2 & ~mask) !== 0
            && (8 & ~mask) !== 0
            && (16 & ~mask) !== 0
            && (64 & ~mask) !== 0
        );
    };

    Square.prototype.isSurrounded = function () {
        return this.mask = 255;
    };

    Square.prototype.onlyAdjacentNorth = function () {
        return (2 & mask) !== 0
            && (1 & ~mask) !== 0
            && (4 & ~mask) !== 0
            && (8 & ~mask) !== 0
            && (16 & ~mask) !== 0
            && (64 & ~mask) !== 0;
    };

    Square.prototype.onlyAdjacentSouth = function () {
        return (64 & mask) !== 0
            && (1 & ~mask) !== 0
            && (4 & ~mask) !== 0
            && (8 & ~mask) !== 0
            && (16 & ~mask) !== 0
            && (2 & ~mask) !== 0;
    };

    Square.prototype.onlyAdjacentEast = function () {
        return (16 & mask) !== 0
            && (1 & ~mask) !== 0
            && (4 & ~mask) !== 0
            && (8 & ~mask) !== 0
            && (2 & ~mask) !== 0
            && (64 & ~mask) !== 0;
    };

    Square.prototype.onlyAdjacentWest = function () {
        return (8 & mask) !== 0
            && (1 & ~mask) !== 0
            && (4 & ~mask) !== 0
            && (2 & ~mask) !== 0
            && (16 & ~mask) !== 0
            && (64 & ~mask) !== 0;
    };

    Square.prototype.wallBorderNorth = function () {
        return (64 & mask) !== 0
            && (1 & ~mask) !== 0
            && (2 & ~mask) !== 0
            && (4 & ~mask) !== 0
            && (8 & mask) !== 0
            && (16 & mask) !== 0;
    };
 
    return Square;
})();
