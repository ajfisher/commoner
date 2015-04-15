/** Hex coordinate mapping system **/

function Hex (q, r, opts) {
    
    if (!(this instanceof Hex)) {
        return new Hex(q, r, opts);
    }

    var priv = {};

    this.q = q;
    this.r = r;

    this.terrain = opts && opts.terrain || TERRAIN.PLAINS;
    
    this.render_tile = cli_render_tile;
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


var cli_render_tile = function(charm, w, h) {
    // renders the tile to the cli
    // assumes cursor has been reset back to mid point so a move can be effected
    // properly based on the hex coords.

    var ho = this.toOffset();
    // move to the offset position from the centre
    charm.move(w * ho[0] + (-ho[0]), h * ho[1] + (-ho[1]));

    if (ho[0] % 2 == 0) {
        charm.move(0, 1);
    }

    var fg = "white";
    var bg = "black";

    switch (this.terrain) {
        case TERRAIN.PLAINS:
            bg = "green";
            break;
        case TERRAIN.WATER:
            bg = "blue";
            break;
        case TERRAIN.FOREST:
            bg = "green";
            fg = "black";
            break;
    };
    // now draw the hex
    charm.foreground("white");
    charm.move(-2, 0);
    charm.write("/");

    charm.background(bg);
    charm.foreground(fg);
    charm.write(" " + this.terrain + " ");
    charm.background("black");
    charm.foreground("white");
    charm.write("\\");
    charm.move(-5, 1);
    charm.write("\\");
    charm.background(bg);
    charm.foreground(fg);
    charm.write("_ _");
    charm.background("black");
    charm.foreground("white");
    charm.write("/");
};

module.exports = Hex;

// circular dependency defined below
var Cube = require("./cube.js");
