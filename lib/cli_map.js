//
// This module provides stitching together of grids in order to actually
// render the map in the CLI. 
//
// This module takes objects and uses protypal extention in order to give them
// additional features - eg render.
//

var charm = null;

var cli = {
    width: 90,
    height: 30,
    centre_x: 50,
    centre_y: 15,
    hex_height: 3,
    hex_width: 5,
};

// FIXME get rid of this and put it in the external module
var TERRAIN = {
    PLAINS: ".",
    WATER: "~",
    FOREST: "#",
};

var cli_render = function(charm, hexkeys, hexmap, opts) {
    // takes the hexmap in the form of a list of keys, a map of hexes (indexed
    // by those keys) and any options provided for size etc and then 
    // renders a map to the screen using charm.js.

    if (typeof opts === "undefined") {
        opts = {};
    }

    charm.background("black");
    charm.erase("screen");

    hexkeys.forEach(function(key) {
        charm.position(cli.centre_x, cli.centre_y);

        var h = hexmap.get(key.toString());
        cli_render_tile(charm, h);

    }.bind(this));

    charm.position(0, cli.height + 2);
};

var cli_render_tile = function(charm, hex) {
    // renders the tile to the cli
    // assumes cursor has been reset back to mid point so a move can be effected
    // properly based on the hex coords.

    var ho = hex.toOffset();
    // move to the offset position from the centre
    charm.move(cli.hex_width * ho[0] + (-ho[0]), cli.hex_height * ho[1] + (-ho[1]));

    if (ho[0] % 2 != 0) {
        charm.move(0, 1);
    }

    var fg = "white";
    var bg = "black";

    switch (hex.terrain) {
        // FIXME refactor this to use an external terrain library
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
    charm.write(" " + hex.terrain + " ");
    charm.background("black");
    charm.foreground("white");
    charm.write("\\");
    charm.move(-5, 1);
    charm.write("\\");
    charm.background(bg);
    charm.foreground(fg);

    charm.write("_");
    if (hex.owner_id > 0) {
        charm.write(hex.owner_id.toString());
    } else {
        charm.write(" ");
    }
    charm.write("_");

    charm.background("black");
    charm.foreground("white");
    charm.write("/");
};

module.exports["render"] = cli_render;
module.exports["dimensions"] = cli;
