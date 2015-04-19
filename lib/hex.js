/** Hex coordinate mapping system **/

function Hex (q, r, opts) {
    // pass in q, r to get a location.
    // opts are used for additional terrain based things etc.

    if (!(this instanceof Hex)) {
        return new Hex(q, r, opts);
    }

    var priv = {};

    this.q = q;
    this.r = r;

    this.terrain = (opts && opts.terrain) || TERRAIN.PLAINS;
    
    this.owner_id = (opts && opts.owner_id) || 0; // defaults to 0 being UNCLAIMED

}

Hex.prototype.toString = function() {
    return ("{ " + this.q + "," + this.r + " }");
};

Hex.prototype.toCube = function() {
    // casts this hex to a cube coordinate

    var x = this.q;
    var z = this.r;
    var y = -x-z;
    return new Cube([x, y, z]);
};

Hex.prototype.toOffset = function(offset_type) {
    // casts the hex to a q, r offset grid position
    return (this.toCube().toOffset(offset_type));
};

var TERRAIN = {
    PLAINS: ".",
    WATER: "~",
    FOREST: "#",
};


module.exports = Hex;

// circular dependency defined below
var Cube = require("./cube.js");
