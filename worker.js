var laplacian = {

    initialise: function(opts) {

                    // creates a lookup table of the indices used to calculate
                    // the laplacian operator. As each cell always uses the same
                    // adjacent cells nearby we don't need to calculate this
                    // constantly in each generation.

                    this.weights = opts.weights || [0.05, 0.2, 0.05, 0.2, -1, 0.2, 0.05, 0.2, 0.05];

                    this.height = opts.height;
                    this.width = opts.height;

                    this.cells = this.width * this.height;

                    var kw = opts.kernel.w || 3;
                    var kh = opts.kernel.h || 3;

                    // do we wrap around or not?
                    var wrap = opts.wrap || false;

                    // get shape of the cells
                    var cw = this..width;
                    var ch = this.height;

                    var lap_indices = [];

                    // iterate over the cell shape and for each cell determine
                    // the indices of adjacent cells according to the kernel distribution
                    for (var x = 0; x < (cw); x++) {
                        for (var y = 0; y < (ch); y++) {

                            var ci = []; // array of indices that reference the adjacent cells
                            // TODO make this work using any sized kernel only works for 3x3 at moment
                            for (var lx = x-1; lx <= x+1; lx++) {
                                for (var ly = y-1; ly <= y+1; ly++) {
                                    if (lx < 0 || lx > cw-1 || ly < 0 || ly > ch-1) {
                                        // detect an edge so work out if it's invalid or to wrap it
                                        if (this.wrap) {
                                            // wrap from one side to the other as a torus

                                            var wx = lx;
                                            if (lx < 0) {
                                                wx = cw-1;
                                            } else if (lx > cw-1) {
                                                wx = 0;
                                            }

                                            var wy = ly;
                                            if (ly < 0) {
                                                wy = ch-1;
                                            } else if (ly > ch -1) {
                                                wy = 0;
                                            }

                                            ci.push(wx * ch + wy);
                                        } else {
                                            // push an invalid position
                                            ci.push(-1);
                                        }
                                    } else {
                                        ci.push(lx* ch + ly);
                                    }
                                }
                            }

                            lap_indices.push(ci);
                        }
                    }

                    this.laplacian_lookup = lap_indices;
    },

    create_lookup: function(opts) {

    },

    calculate: function(from, to) {

    },

}
