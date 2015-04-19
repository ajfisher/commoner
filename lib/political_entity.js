// represents a political sphere in the game.

var Hex = require("./hex.js");
var Cube = require("./cube.js");

var RACES = {
    HUMAN: {
        type: "Human",
        preferences: {
            plains: 0.50,
            forest: 0.20,
            sea: 0.20,
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

    this.capabilities = this.race.preferences;
    var current_capabilities = this.capabilities;

    this.starting_position = opts.starting_position; // pointer to hex that was starting point
    this.territory.push(this.starting_position);

    this.hexmap = opts.hexmap;

    // FIXME make this go through a setter on the HEX
    this.hexmap.get(this.starting_position.toString()).owner_id = this.id;
}

// TODO: I WILL have to have the notion of the grid map to some extent because
// we need to calculate the points available and do to do that it needs to
// have a reference to the grid.

PoliticalEntity.prototype.add_territory = function(coords) {

    console.log(coords.toString());

    this.territory.push(coords);

    this.hexmap.get(coords.toString()).owner_id = this.id;
};

PoliticalEntity.prototype.territory_calculations = function() {
    // updates the action points available based on capabilities and hexes owned.
    
    // for each territory
    //      count terrain type to terrain type counter << #Possibly do on acquire land
    // for each terrain type
    //      earnt (this land type) = current capability * number terrain hexes * resources per hex
    //      propensity modified = earnt (this land type) + current_capability
    //      cost to claim = 1 / (current_capability + proportion of total)
    //
    // sum modified propensity for all terrains.
    // for each terrain type
    //      current capability = propensity_modified / sum modified propensity
    //
    // 

};



module.exports = PoliticalEntity; 
module.exports["RACES"] = RACES;

