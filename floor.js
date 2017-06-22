var Floor = (function() {
 
    function Floor(width, height) {
        this.width = width;
        this.height = height;
        this.makeMap();
        this.boss = {x: 0, y: 0};
    }
 
    Floor.prototype.makeMap = function () {
        this.map = [[]];
        for (var i = 0; i < this.width; i++) {
            this.map[i] = [];
            for (var j = 0; j < this.height; j++) {
                this.map[i][j] = Square.FILLED;
            }
        }
    };
 
    Floor.prototype.length = function () {
        return this.map.length;
    };
 
    Floor.prototype.rowLength = function () {
        return this.map[0].length;
    };
 
    Floor.prototype.getSquare = function (x, y) {
        if (typeof this.map[x] === 'undefined' || typeof this.map[x][y] === 'undefined') {
            return Square.OUT_OF_BOUNDS;
        }
        return this.map[x][y];
    };
 
    Floor.prototype.isEdge = function (x, y) {
        return x === 0 || x === this.length() -1 || y === 0 || y === this.rowLength() -1;
    };
 
    Floor.prototype.setSquare = function (x, y, squareType) {
        if (this.isEdge(x, y)) {
            squareType = squareType === Square.EMPTY ? Square.FILLED : squareType;
        }
        this.map[x][y] = squareType;
    };
 
    Floor.prototype.setBossPos = function (x, y) {
        this.boss = {x: x, y: y};
    };
 
    Floor.prototype.getBossPos = function () {
        return this.boss;
    };

    Floor.prototype.isEmpty = function (x, y) {
        var square = this.getSquare(x, y);
        return square === Square.EMPTY;
    };
 
    return Floor;
})();
