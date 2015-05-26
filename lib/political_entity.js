// represents a political sphere in the game.
var _ = require("underscore");
var Hex = require("./hex.js");
var Cube = require("./cube.js");

var RACES = {
    HUMAN: {
        type: "Human",
        preferences: {
            plains: 0.50,
            forest: 0.20,
            water: 0.20,
            mountain: 0.10,
        },
        pref_modifiers_max: {
            plains: 0.7,
            forest: 0.4,
            water: 0.4,
            mountain: 0.3,
        },
    },
    ELF: {
        type: "Human",
        preferences: {
            plains: 0.20,
            forest: 0.50,
            water: 0.20,
            mountain: 0.10,
        },
        pref_modifiers_max: {
            plains: 0.7,
            forest: 0.4,
            water: 0.4,
            mountain: 0.3,
        },
    },
    DWARF: {},
    ORC: {},
};

function PoliticalEntity(id, opts) {

    if (!(this instanceof PoliticalEntity)) {
        return new PoliticalEntity(opts);
    }

    this.id = id || 0; // identifier for other aspects
    this.territory = []; // array of cube coords hashes for territory owned
    this.action_points = 0; // action points for spending.
    this.race = (opts && opts.race) || RACES.HUMAN;

    this.capabilities = this.race.preferences; // used to store initial prefs
    this.current_capabilities = this.capabilities; // this changes over time
    this.claim_costs = {}; // how much each type of land costs to claim.

    this.starting_position = opts.starting_position; // pointer to hex that was starting point
    this.territory.push(this.starting_position);

    this.hexmap = opts.hexmap;

    this.hexmap.get(this.starting_position.toString()).owner_id = this.id;
}

// TODO: I WILL have to have the notion of the grid map to some extent because
// we need to calculate the points available and do to do that it needs to
// have a reference to the grid.

PoliticalEntity.prototype.add_territory = function(coords) {
    // adds a territory given by its cubic coordinates

    this.territory.push(coords);

    this.hexmap.get(coords.toString()).owner_id = this.id;
};

PoliticalEntity.prototype.get_neighbouring_territories = function() {
    // Gets a list of all the neighbouring hexes for the PE.

    var neighbours = [];

    // find all if the PEs territories, go through the neighbours
    // of each and if they don't belong to the PE add them to the master
    // neighbours list.
    this.territory.forEach(function(hex) {
        _.each(hex.neighbours, function(coords, direction) {
            var h = this.hexmap.get((new Cube(coords)).toString());
            if (h !== undefined && h.owner_id != this.id) {
                neighbours.push(h);
            }
        }.bind(this));
    }.bind(this));

    // remove any duplicates and send back the array.
    return (_.uniq(neighbours));
};

PoliticalEntity.prototype.determine_acquisition_costs = function(territories) {
    // take a list of territories and determine the acquisition cost of each
    // returns the same list, with costs and sorted min to max

    var hexes = [];

    territories.forEach(function(hex) {
        var cost = 0;
        // FIXME This is a hack for the moment
        if (hex.terrain == TERRAIN.plains) {
            cost = this.claim_costs.plains;
        } else if (hex.terrain == TERRAIN.forest) {
            cost = this.claim_costs.forest;
        }

        //console.log("BC: ", hex.terrain, cost.toFixed(2));

        // go through each neighbour of the hex and determine 
        // what boundaries are shared and whether there are any terrains
        // that are the same as the one we're looking at.
        var owned_borders = 0;
        var same_terrain = false;
        _.each(hex.toCube().neighbours, function(coords, direction) {
            var h = this.hexmap.get(new Cube(coords).toString());
            if (h !== undefined) {
                if (h.owner_id == this.id) {
                    owned_borders = owned_borders + 1;

                    // check if the owned hex is of the same type as the desired one
                    if (h.terrain == hex.terrain) {
                        same_terrain = true;
                    }
                }
            }
        }.bind(this));
        //console.log("OB: ", hex.toString(), owned_borders); 

        // apply a discount (max 25%) if you own more than 1 border alongside
        // the hex we are looking at.
        if (owned_borders > 1) {
            cost = cost - (owned_borders * 0.05 * cost);
        }
        //console.log("OBDC: ", hex.toString(), cost.toFixed(2));

        // if the terrain is different from those that border it owned by the PE
        // then it incurs a cost to acquire it.
        if (! same_terrain) {
            cost = cost * 2;
            //console.log("DTC: ", hex.toString(), cost.toFixed(2));
        }

        if (hex.owner_id != 0) {
            cost = cost * 10;
            //console.log("EC: ", hex.toString(), cost.toFixed(2));
        }

        //console.log("---");

        hex["cta"] = cost;

        hexes.push(hex);
    }.bind(this));

    // sort by CTA to get a useful list of selection hexes.
    var sorted = _.sortBy(hexes, function(hex) {return hex.cta; });
    return (sorted)
};

PoliticalEntity.prototype.acquire_territory = function(acquisition_list) {
    // looks through the list of territories provided and acquires any hexes
    // that it can.

    if (this.action_points > acquisition_list[0].cta) {

        //console.log("acquire hex");
        // filter out only those hexes that we can actually use.
        var aquirable = _.filter(acquisition_list, function(hex) {
            if (hex.cta < this.action_points) {
                return hex;
            }
        }.bind(this));

        // now randomly select one from the list
        var acq_index = Math.floor(Math.random() * aquirable.length);

        var acq_hex = aquirable[acq_index];
        //console.log("T: ", acq_hex.cta.toFixed(2), "AP: ", this.action_points.toFixed(2));
        this.add_territory(acq_hex.toCube());
        this.action_points = this.action_points - acq_hex.cta;
        //console.log("AP: ", this.action_points.toFixed(2));
        return (this.action_points > acquisition_list[0].cta);
    }

};

PoliticalEntity.prototype.territory_calculations = function() {
    // updates the action points available based on capabilities and hexes owned.

    var total_territories = this.territory.length;

    var hexes = this.territory.map(function(current, index, array) {
        // gets all of the owned hexes from the hex map and makes them available.
        return this.hexmap.get(current.toString());
    }.bind(this));


    var grouped_hexes = _.groupBy(hexes, function(hex) {
        // groups all the hexes according to their terrain type.
        return (hex.terrain);
    });

    var resource_proportions = {};
    var earnt = {};
    var mod_capability = {};
    var resource_diffs = {};
    var resource_per_hex = 0.1;

    // FIXME MAY NOT BE NEEDED
    //var capability_total = _.reduce(this.current_capabilities, function(memo, num) { return memo + num; });
    //console.log("CCT: ", capability_total);

    // get number of hexes of each type and then work out AP earnings and
    // how that changes capabilities for future rounds
    for (var tkey in TERRAIN) {
        var num_hexes_owned = _.size(grouped_hexes[TERRAIN[tkey]]);
        resource_proportions[tkey] = num_hexes_owned / hexes.length;
        resource_diffs[tkey] = resource_proportions[tkey] - this.current_capabilities[tkey];

        var terr_base_cost = (1 / this.current_capabilities[tkey]);

        if (resource_diffs[tkey] < 0) {
            // we are below our baseline so we need to incur an earning and cost penalty
            var modifier = this.current_capabilities[tkey] + resource_diffs[tkey];
            earnt[tkey] = modifier * num_hexes_owned * resource_per_hex;
            this.claim_costs[tkey] = (1 + Math.abs(resource_diffs[tkey])) * terr_base_cost;
        } else if (resource_diffs[tkey] > 0) {
            // we are above and so we incur a bonus
            var modifier = (resource_diffs[tkey] / this.current_capabilities[tkey]) * 0.1; // note each rank of bonus = 10% benefit
            earnt[tkey] = (1 + modifier) * (this.current_capabilities[tkey] * num_hexes_owned * resource_per_hex);
            this.claim_costs[tkey] = (1-modifier) * terr_base_cost;
        } else {
            // we are zero so baseline it.
            earnt[tkey] = this.current_capabilities[tkey] * num_hexes_owned * resource_per_hex;
            this.claim_costs[tkey] = terr_base_cost;
        }
        //earnt[tkey] = num_hexes_owned * resource_per_hex * (this.current_capabilities[tkey] / capability_total);
        //mod_capability[tkey] = (this.current_capabilities[tkey]/capability_total) * Math.pow(2, resource_proportions[tkey]);
        // don't allow refactored caps to fall below the baseline level. 
        //if (mod_capability[tkey] < this.capabilities[tkey]) {
        //    mod_capability[tkey] = this.capabilities[tkey];
        //}
    }

    // get totals for new capabilities after this round
    //var mod_capability_total = _.reduce(mod_capability, function(memo, num) { return memo + num; });

    this.action_points += _.reduce(earnt, function(memo, num) {return memo+num; });

    //console.log("MCT: ", mod_capability_total);

    // get updated costs to claim each type of territory and update capabilities
    // for the next round of resource earning.
//    for (var tkey in TERRAIN) {
//        this.claim_costs[tkey] = 1 / (this.current_capabilities[tkey] / capability_total);
//        this.current_capabilities[tkey] = mod_capability[tkey];
//    }
/**    console.log("TH: " + hexes.length);
    console.log("H: ", grouped_hexes)
    console.log("CC: ", this.current_capabilities);
    console.log("RP: ", resource_proportions);
    console.log("RD: ", resource_diffs);
    console.log("$$: ", earnt);
    console.log("AP: ", this.action_points);
//    console.log("MC: ", mod_capability);
    console.log("C2C: ", this.claim_costs);
//    console.log("CC(mod): ", this.current_capabilities);
    console.log("-----");**/

};


// FIXME get rid of this and put it in the external module
var TERRAIN = {
    plains: ".",
    water: "~",
    forest: "#",
    mountain: "^",
};

module.exports = PoliticalEntity; 
module.exports["RACES"] = RACES;

