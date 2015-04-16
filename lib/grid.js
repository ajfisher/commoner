/** defines the world grid **/

var Cube = require("./cube.js");

function Grid(opts) {

    if (!(this instanceof Grid)) {
        return new Grid(opts);
    }

    this.hexmap = Map(); //WeakMap();
    this.hexkeys = [];

    this.layout = opts && opts.layout || this.LAYOUT_TYPES.ODD_Q_VER;

    this.height = 0;
    this.width = 0;

    this.render = cli_render;
}

Grid.prototype.LAYOUT_TYPES = {
    ODD_R_HOR: 0,
    EVEN_R_HOR: 1,
    ODD_Q_VER: 2,
    EVEN_Q_VER: 3,
};

Grid.prototype.load_data = function(opts) {
    // takes data in an offset grid form of array and then loads it into
    // a functional hexmap. Note that there is an assumption that the 
    // array provided is 2D with odd rows and cols so that there is a definable
    // centre point. If that's not the case then an error is thrown.


    if (opts === undefined || opts.data === undefined || opts.data === null) {
        throw TypeError("No data provided");
    }

    var data = opts.data;

    if (data.length % 2 == 0 || data[0].length % 2 == 0) {
        throw RangeError("Data incorrect shape - ODD 2D required (R:" + data.length + " C: " + data[0].length + ")");
    }

    // now we process the data according to the hexmap layout.

    this.height = data.length;
    this.width = data[0].length;

    this.centre_q = (this.width - 1) / 2;
    this.centre_r = (this.height -1) /2;

    for (var row = 0; row < this.height; row++) {
        var str1 = "";
        var str2 = "";

        for (var col = 0; col < this.width; col++) {
            var c = new Cube ([], {type: "offset", layout: "odd_q", q: col-this.centre_q, r: row-this.centre_r});
            var h = c.toHex();
            h.terrain = data[row][col];
            this.hexkeys.push(c);
            this.hexmap.set(c.toString(), h);

/**            if (h.q % 2 == 0) {
                str1 = str1 + this.hexmap.get(c.toString()).toCube();
                str2 = str2 + "   ";
            } else {
                str1 = str1 + "   ";
                str2 = str2 + this.hexmap.get(c.toString()).toCube();
            }**/
        }
    }
};

Grid.prototype.update_owner = function(coords, id) {
    // updates the owner of the hex at @coords (cube coords) to
    // the entity given by @id

    // FIXME do this through a setter instead.
    this.hexmap.get(coords.toString()).owner_id = id;
};


var cli_defaults = {
    cli_width: 90,
    cli_height: 30,
    cli_centre_x: 40,
    cli_centre_y: 15,
    hex_height: 3,
    hex_width: 5,
};


var cli_render = function(charm, opts) {
    // renders the grid to the screen in a cli form using Charm JS

    if (typeof opts === "undefined") {
        opts = cli_defaults;
    }

    var cli_width = opts.cli_width;
    var cli_height = opts.cli_height;

    var cli_centre_x = opts.cli_centre_x;
    var cli_centre_y = opts.cli_centre_y;

    var hex_width = opts.hex_width;
    var hex_height = opts.hex_height;

    charm.background("black");
    charm.erase("screen");

    this.hexkeys.forEach(function(key) {
        charm.position(cli_centre_x, cli_centre_y);

        var h = this.hexmap.get(key.toString());
        h.render_tile(charm, hex_width, hex_height);

    }.bind(this));

    charm.position(0, cli_height + 2);
};

module.exports = Grid;

