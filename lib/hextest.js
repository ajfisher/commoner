var charm = require("charm")();
var Cube = require("./cube.js");
var Grid = require("./grid.js");
var PoliticalEntity = require("./political_entity.js");

var CLIRender = require("./cli_map.js");

var map_data = [
    ["~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~"],
    ["~",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".","#","#",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".","#","#",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".",".","#",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".",".","#",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","~"],
    ["~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~"],
];

charm.pipe(process.stdout);

var g = new Grid();
g.load_data({data: map_data});

var current_pos = new Cube([0,0,0]);

var c = new Cube([0,0,0]);
var pe = new PoliticalEntity(1, {
    race: PoliticalEntity.RACES.HUMAN,
    starting_position: c,
    hexmap: g.hexmap,
});

CLIRender.render(charm, g.hexkeys, g.hexmap);


//console.log(pe);

//console.log(PoliticalEntity.RACES);

// use this to get the info about each race group.
// Can use this technique for terrain.
/**for (var key in PoliticalEntity.RACES){
    console.log(key);
    console.log(PoliticalEntity.RACES[key]);
};**/

