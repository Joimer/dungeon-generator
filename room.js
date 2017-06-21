var Room = (function() {
 
    function Room(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
 
    Room.prototype.overlaps = function (room) {
        return this.x < room.x + room.width
        && this.x + this.width > room.x
        && this.y < room.y + room.height
        && this.height + this.y > room.y;
    };
 
    Room.prototype.toString = function() {
        return 'x: ' + this.x + ', y: ' + this.y + ', width: ' + this.width + ', height: ' + this.height;
    };
 
    Room.prototype.getNorthExit = function () {
        return {
            x: this.x + Math.floor(this.width / 2),
            y: this.y
        };
    };
 
    Room.prototype.getSouthExit = function () {
        return {
            x: this.x + Math.floor(this.width / 2),
            y: this.y + this.height
        };
    };
 
    Room.prototype.getEastExit = function () {
        return {
            x: this.x + this.width,
            y: this.y + Math.floor(this.height / 2)
        };
    };
 
    Room.prototype.getWestExit = function () {
        return {
            x: this.x,
            y: this.y + Math.floor(this.height / 2)
        };
    };
 
    Room.prototype.getCenter = function () {
        return {
            x: this.x + Math.ceil(this.width / 2),
            y: this.y + Math.ceil(this.height / 2)
        };
    };
 
    return Room;
})();
