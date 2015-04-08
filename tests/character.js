var Character = require("../lib/character.js");
var sinon = require("sinon");
var att = {
    str: 12,
    con: 13,
    dex: 14,
    int: 16,
    cha: 17,
    wis: 15,
}

exports["character"] = {

    setUp: function(done) {

        this.character = new Character({
            str: att.str,
            con: att.con,
            dex: att.dex,
            int: att.int,
            cha: att.cha,
            wis: att.wis,
        });

        done();
    },

    tearDown: function(done) {
        done();
    },

    created: function(test) {

        test.expect(1);

        test.equal(typeof(this.character), "object", "Character created");

        test.done();
    },

    attributes: function(test) {
        test.expect(6);
        test.equal(this.character.str, att.str, "STR");

        test.equal(this.character.dex, att.dex, "DEX");
        test.equal(this.character.int, att.int, "INT");
        test.equal(this.character.cha, att.cha, "CHA");
        test.equal(this.character.wis, att.str, "WIS");
        test.equal(this.character.con, att.str, "CON");
        test.done();
    },

};

