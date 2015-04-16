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

    this.starting_position = opts.starting_position; // pointer to hex that was starting point
    this.territory.push(this.start_position);
}

PoliticalEntity.prototype.add_territory = function(coords) {
    this.territory.push(coords);
};

module.exports = PoliticalEntity; 
module.exports["RACES"] = RACES;
