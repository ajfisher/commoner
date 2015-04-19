/** Cube Coordinates definition for hex mapping **/

// provides the cardinal directions from a hex in order to map it to
// an array of directions.
var DIRECTIONS = {
    NW: 0,
    N: 1,
    NE: 2,
    SW: 3,
    S: 4,
    SE: 5,
};


function Cube (vec, opts) {
   // creates a cube coordinate system.
   // @vec is an array in form [x,y,z]
   // @opts provide options for building a cube from offset coords.


    if (!(this instanceof Cube)) {
        return new Cube(vec, opts);
    }

    var x = y = z = 0;

    if (vec.length == 3) {
        x = vec[0];
        y = vec[1];
        z = vec[2];
    }

    // use this to construct a cube using offset grids at the moment.
    // TODO enable this for a wider bunch of things than simply ODD Q
    if (opts !== undefined) {
        if (opts.type == "offset") {
            if (opts.layout == "odd_q") {
                x = opts.q;
                z = opts.r - (opts.q - (opts.q & 1)) /2;
                y = -x-z;
            }
        }
    }

    this.x = x;
    this.y = y;
    this.z = z;

    this.neighbours = {
        NW: [x-1, y+1, z],
        N:  [x, y+1, z-1],
        NE: [x+1, y, z-1],
        SW: [x-1, y, z+1],
        S:  [x, y-1, z+1],
        SE: [x+1, y-1, z]
    };

}
Cube.prototype.toHex = function() {
    // casts the cube to hex coordinates

    var q = this.x;
    var r = this.z;
    return(new Hex(q, r));
};

Cube.prototype.toString = function() {
    return ("{" + this.x + "," + this.y + "," + this.z + "}");
};

Cube.prototype.toOffset = function(layout_type) {

    var q = this.x;
    var r = this.z + (this.x - (this.x & 1)) / 2;

    return [q, r]
};

module.exports = Cube;

// circular dependencies defined here
var Hex = require("./hex.js");
