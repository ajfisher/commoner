var charm = require("charm")();
var Cube = require("./cube.js");
var Grid = require("./grid.js");
var PoliticalEntity = require("./political_entity.js");

var keypress = require("keypress");
keypress(process.stdin);

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

//pe.add_territory(new Cube([-1,0,1]));
//pe.add_territory(new Cube([-6,4,2]));

charm.background("black");
charm.erase("screen");

CLIRender.render(charm, g.hexkeys, g.hexmap);

CLIRender.info(charm, current_pos, g.hexmap);

//console.log(pe);

//console.log(PoliticalEntity.RACES);

// use this to get the info about each race group.
// Can use this technique for terrain.
/**for (var key in PoliticalEntity.RACES){
    console.log(key);
    console.log(PoliticalEntity.RACES[key]);
};**/


process.stdin.on("keypress", function(ch, key){

    var c = null;

    if (! key) {
        return;
    }

    if (key.name == "x") {
        process.exit();
    } else if (key.name == "w") {
        c = new Cube(current_pos.neighbours.N);
    } else if (key.name == "s") {
        c = new Cube(current_pos.neighbours.S);
    } else if (key.name == "q") {
        c = new Cube(current_pos.neighbours.NW);
    } else if (key.name == "e") {
        c = new Cube(current_pos.neighbours.NE);
    } else if (key.name == "a") {
        c = new Cube(current_pos.neighbours.SW);
    } else if (key.name == "d") {
        c = new Cube(current_pos.neighbours.SE);
    } else if (key.name == "p") {
        pe.territory_calculations();
    }

    if (c !== null) {
        if (g.hexmap.get(c.toString()) !== undefined) {
            current_pos = c;
        }
    }

    CLIRender.render(charm, g.hexkeys, g.hexmap);
    CLIRender.info(charm, current_pos, g.hexmap);
    CLIRender.entity_info(charm, pe);

});

process.on("exit", function() {
    charm.reset();
    console.log("Thank you, come again.");
});


process.stdin.setRawMode(true);
process.stdin.resume();

