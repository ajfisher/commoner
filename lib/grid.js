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
//        console.log(str1);
//        console.log(str2);
    }
};




module.exports = Grid;

