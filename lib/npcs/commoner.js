/**
    Used to model an NPC at various ages in their life

    General approach is this:

    Consider the age of maturity (eg 16 for Humans)
    At Maturity the character hits 0xp and becomes Level 1 and 
    is granted their racial modifiers and L1 skill proficiencies
    Below maturity they are 10s in terms of attributes and have no
    proficiencies.
    Below half maturity then they have penalties on all attributes (-2 across
    the board).
    At middle age -1 Str, Dex, Con, +1 Int, Wis, Cha
    Old age -2 Str, Dex, Con, +1 Int, Wis, Cha
    Venerable -3 Str, Dex, Con, +1 Int, Wis, Cha

    Experience accrues at 1xp per day to middle age, 0.75xp per day to old age,
    0.5xp per day to venerable, 0.25xp past venerable to max age.

**/

var days_per_year = 365;

age_groups = ["child", "teen", "mature", "middle", "old", "venerable"];


var age_mods = {
    child: {
        str: -2, dex: -2, con: -2, int: -2, wis: -2, cha: -2,
    },
    teen: {
        str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0,
    },
    mature: {
        str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0,
    },
    middle: {
        str: -1, dex: -1, con: -1, int: 1, wis: 1, cha: 1,
    },
    old: {
        str: -3, dex: -3, con: -3, int: 2, wis: 2, cha: 2,
    },
    venerable: {
        str: -6, dex: -6, con: -6, int: 3, wis: 3, cha: 3,
    },
};


var RACES = {
    HUMAN: {
        name: "human",
        bonuses: {
            str: 1, int: 1, con: 1, wis: 1, cha: 1, dex: 1,
        },
        ages: {
            child: 5,
            teen: 10,
            mature: 16,
            middle: 35,
            old: 53,
            venerable: 70,
        },
    },
    ELF: {
    },
    DWARF: {
    },
};

function Character(opts) {


    if (!(this instanceof Character)) {
        return new Character(opts);
    }

    if (!opts || !opts.race) {
        console.log("No race given, setting human");
        this.race = RACES.HUMAN;
    } else {
        this.race = opts.race;
    }

    if (!opts || !opts.age) {
        console.log("No age given, set mature");
        this.age = this.race.ages.mature;
    } else {
        this.age = opts.age;
    }

    this.str = 10;
    this.int = 10;
    this.dex = 10;
    this.wis = 10;
    this.con = 10;
    this.cha = 10;

    this.level = 0;
    this.xp = 0;

    this.max_age = 70; // absolute highest age possible.
    this.weight = 0;
    this.height = 0;

    this.age_group = "mature";
    this.skills = [];
    this.proficiencies = [];
}

Character.prototype.age_character = function(years) {
    // Ages a character by the number of years and calculates the relevant
    // information as a result of that.

    var new_age = this.age + years;
    var days_elapsed = new_age * days_per_year;

    // look up each new level that has been moved through.
    // For each level apply the relevant modifiers.

    // 

};

var john = new Character();
console.log(john);








