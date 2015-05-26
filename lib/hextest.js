var charm = require("charm")();
var Cube = require("./cube.js");
var Grid = require("./grid.js");
var PoliticalEntity = require("./political_entity.js");

var keypress = require("keypress");
keypress(process.stdin);

var CLIRender = require("./cli_map.js");

var map_data = [
    ["~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~"],
    ["~",".",".",".","~",".",".",".",".",".",".","~","~",".",".",".",".",".","~"],
    ["~",".","#","#","#","#",".",".",".",".",".",".","~",".",".",".",".",".","~"],
    ["~",".","#","#","#",".",".",".",".",".",".",".","~","~",".",".",".",".","~"],
    ["~",".",".","#",".",".",".",".",".",".",".",".","~",".",".",".",".",".","~"],
    ["~",".","#","#",".",".",".",".",".",".",".",".","#",".",".",".",".",".","~"],
    ["~",".","#",".",".",".",".",".",".","#","#","#","#","#",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".",".","~","#",".",".",".",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".",".","~","~",".",".",".",".",".",".",".","~"],
    ["~",".",".",".",".",".",".",".","~","~",".",".",".",".",".",".",".",".","~"],
    ["~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~","~"],
];

charm.pipe(process.stdout);

var turn_no = 0;

var g = new Grid();
g.load_data({data: map_data});

var current_pos = new Cube([0,0,0]);

//var c = new Cube([0,0,0]);
//
var pes = [];
pes.push(new PoliticalEntity(1, {
    race: PoliticalEntity.RACES.HUMAN,
    starting_position: new Cube([0,0,0]),
    hexmap: g.hexmap,
}));

pes.push(new PoliticalEntity(2, {
    race: PoliticalEntity.RACES.ELF,
    starting_position: new Cube([-6, 5, 1]),
    hexmap: g.hexmap,
}));

charm.background("black");
charm.erase("screen");

CLIRender.render(charm, g.hexkeys, g.hexmap);

CLIRender.info(charm, current_pos, g.hexmap);


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
        pes.forEach(function(pe) {
            pe.territory_calculations();
            var neighbours = pe.get_neighbouring_territories();
            var acquisition_list = pe.determine_acquisition_costs(neighbours);
            pe.acquire_territory(acquisition_list);
        });
        ++turn_no;
    }

    if (c !== null) {
        if (g.hexmap.get(c.toString()) !== undefined) {
            current_pos = c;
        }
    }

    charm.write("Turn: " + turn_no);

    CLIRender.render(charm, g.hexkeys, g.hexmap);
    CLIRender.info(charm, current_pos, g.hexmap);
    CLIRender.entity_info(charm, pes[0]);

});

process.on("exit", function() {
    charm.reset();
    console.log("Thank you, come again.");
});


process.stdin.setRawMode(true);
process.stdin.resume();

