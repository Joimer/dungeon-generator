class Room {
 
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
 
    overlaps(room) {
        return this.x < room.x + room.width
        && this.x + this.width > room.x
        && this.y < room.y + room.height
        && this.height + this.y > room.y;
    }
 
    toString() {
        return 'x: ' + this.x + ', y: ' + this.y + ', width: ' + this.width + ', height: ' + this.height;
    }
 
    getNorthExit() {
        return {
            x: this.x + Math.floor(this.width / 2),
            y: this.y
        };
    }
 
    getSouthExit() {
        return {
            x: this.x + Math.floor(this.width / 2),
            y: this.y + this.height
        };
    }
 
    getEastExit() {
        return {
            x: this.x + this.width,
            y: this.y + Math.floor(this.height / 2)
        };
    }
 
    getWestExit() {
        return {
            x: this.x,
            y: this.y + Math.floor(this.height / 2)
        };
    }
 
    getCenter() {
        return {
            x: this.x + Math.ceil(this.width / 2),
            y: this.y + Math.ceil(this.height / 2)
        };
    }
}
