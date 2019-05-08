class Floor {
 
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.makeMap();
        this.boss = {x: 0, y: 0};
    }
 
    makeMap() {
        this.map = [[]];
        for (let i = 0; i < this.width; i++) {
            this.map[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.map[i][j] = SquareType.FILLED;
            }
        }
    }
 
    length() {
        return this.map.length;
    }
 
    rowLength() {
        return this.map[0].length;
    }
 
    getSquare(x, y) {
        if (typeof this.map[x] === 'undefined' || typeof this.map[x][y] === 'undefined') {
            return SquareType.OUT_OF_BOUNDS;
        }
        return this.map[x][y];
    }
 
    isEdge(x, y) {
        return x === 0 || x === this.length() -1 || y === 0 || y === this.rowLength() -1;
    }
 
    setSquare(x, y, squareType) {
        // This shouldn't happen, but:
        // If a square is empty on an edge, we fill it,
        // so there's a filled square on all the edges.
        if (this.isEdge(x, y)) {
            squareType = squareType === SquareType.EMPTY ? SquareType.FILLED : squareType;
        }
        this.map[x][y] = squareType;
    }
 
    setBossPos(x, y) {
        this.boss = {x: x, y: y};
    }
 
    getBossPos() {
        return this.boss;
    }

    isEmpty(x, y) {
        let square = this.getSquare(x, y);
        return square === SquareType.EMPTY;
    }
}
