//
// This module provides stitching together of grids in order to actually
// render the map in the CLI. 
//
// This module takes objects and uses protypal extention in order to give them
// additional features - eg render.
//

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

function hex_cli_position(vec) {
    // given q and r of a hex in a vector array
    // , return the x and y positions of the starting
    // poing as it would be projected onto the screen.
    var x = cli.hex_width * vec[0] + (-vec[0]);
    var y = cli.hex_height * vec[1] + (-vec[1]);

    if (vec[0] % 2 != 0) {
        y = y + 1 ;
    }
    return({
        x: x,
        y: y,
    });
}

var cli_render = function(charm, hexkeys, hexmap, opts) {
    // takes the hexmap in the form of a list of keys, a map of hexes (indexed
    // by those keys) and any options provided for size etc and then 
    // renders a map to the screen using charm.js.

    if (typeof opts === "undefined") {
        opts = {};
    }

    hexkeys.forEach(function(key) {
        charm.position(cli.centre_x, cli.centre_y);

        var h = hexmap.get(key.toString());
        cli_render_tile(charm, h);

    });
};

var cli_render_tile = function(charm, hex) {
    // renders the tile to the cli
    // assumes cursor has been reset back to mid point so a move can be effected
    // properly based on the hex coords.

    // move to the offset position from the centre
    var pos = hex_cli_position(hex.toOffset());
    charm.move(pos.x, pos.y);

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

cli_write_info = function(charm, c, hexmap) {
    // takes the cube given at c and then looks up hexmap to get a bunch of
    // information about it and then uses charm to write it to the screen.

    var vpos = 2;
    var lpos = cli.width + 2;

    var h = hexmap.get(c.toString());

    charm.position(lpos, vpos++);
    charm.write("Hex Info: " + h.toString());
    charm.erase("end");

    charm.position(lpos, vpos++);
    charm.write("Cube coords: " + c.toString());
    charm.erase("end");

    charm.position(lpos, vpos++);
    charm.write("Terrain: " + h.terrain);

    charm.position(lpos, vpos++);
    charm.write("Owner: " + h.owner_id);

    // move to the offset position from the centre
    var pos = hex_cli_position(h.toOffset());
    charm.position(cli.centre_x, cli.centre_y);
    charm.move(pos.x, pos.y);
    charm.foreground("magenta");
    charm.write("_");
    charm.foreground("white");

    charm.position(0, cli.height+2);
};

cli_pe_state = function(charm, pe) {
    // takes a political entity and outputs the current details of them 
    // to the display.
    
    var vpos = 6;
    var lpos = cli.width + 2;

    charm.position(lpos, vpos++);
    charm.write("AP: " + pe.action_points.toFixed(2));
    charm.erase("end");

    charm.position(lpos, vpos++);
    charm.write("Costs:");
    
    for (var tkey in pe.claim_costs) {
        charm.position(lpos, vpos++);
        charm.write(tkey + ": " + pe.claim_costs[tkey].toFixed(2));
        charm.erase("end");
    }

    charm.position(0, cli.height+2);
};

module.exports["render"] = cli_render;
module.exports["info"] = cli_write_info;
module.exports["dimensions"] = cli;
module.exports["entity_info"] = cli_pe_state;


