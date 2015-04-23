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
            sea: 0.4,
            mountain: 0.3,
        },
    },
    ELF: {},
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

    this.territory.push(coords);

    this.hexmap.get(coords.toString()).owner_id = this.id;
};

PoliticalEntity.prototype.territory_calculations = function() {
    // updates the action points available based on capabilities and hexes owned.

    var total_territories = this.territory.length;

    var hexes = this.territory.map(function(current, index, array) {
        // gets all of the owned hexes from the hex map and makes them available.
        return this.hexmap.get(current.toString());
    }.bind(this));

    //console.log("TH: " + hexes.length);

    var grouped_hexes = _.groupBy(hexes, function(hex) {
        // groups all the hexes according to their terrain type.
        return (hex.terrain);
    });

    var resource_proportions = {};
    var earnt = {};
    var mod_capability = {};
    var resource_per_hex = 0.1;

    var capability_total = _.reduce(this.current_capabilities, function(memo, num) { return memo + num; });
    //console.log("CCT: ", capability_total);

    // get number of hexes of each type and then work out AP earnings and
    // how that changes capabilities for future rounds
    for (var tkey in TERRAIN) {
        var num_hexes_owned = _.size(grouped_hexes[TERRAIN[tkey]]);
        earnt[tkey] = num_hexes_owned * resource_per_hex * (this.current_capabilities[tkey] / capability_total);
        resource_proportions[tkey] = num_hexes_owned / hexes.length;

        mod_capability[tkey] = (this.current_capabilities[tkey]/capability_total) * Math.pow(2, resource_proportions[tkey]);
        // don't allow refactored caps to fall below the baseline level. 
        if (mod_capability[tkey] < this.capabilities[tkey]) {
            mod_capability[tkey] = this.capabilities[tkey];
        }
    }

    //console.log("RP: ", resource_proportions);
    //console.log("$$: ", earnt);
    //console.log("CC: ", this.current_capabilities);
    //console.log("MC: ", mod_capability);

    // get totals for new capabilities after this round
    //var mod_capability_total = _.reduce(mod_capability, function(memo, num) { return memo + num; });

    this.action_points += _.reduce(earnt, function(memo, num) {return memo+num; });

    //console.log("AP: ", this.action_points);
    //console.log("MCT: ", mod_capability_total);

    // get updated costs to claim each type of territory and update capabilities
    // for the next round of resource earning.
    for (var tkey in TERRAIN) {
        this.claim_costs[tkey] = 1 / (this.current_capabilities[tkey] / capability_total);
        this.current_capabilities[tkey] = mod_capability[tkey];
    }
    //console.log("C2C: ", this.claim_costs);
    //console.log("CC(mod): ", this.current_capabilities);
    //console.log("-----");

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

