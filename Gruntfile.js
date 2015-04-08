var fs = require("fs");

module.exports = function(grunt) {

    var task = grunt.task;
    var file = grunt.file;
    var log = grunt.log;
    var verbose = grunt.verbose;
    var fail = grunt.fail;
    var config = grunt.config;


    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        nodeunit: {
            tests: [
                "tests/*.js",
            ],
            options: {
                reporter: 'default',
            },
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                latedef: false,
                noarg: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                strict: false,
                esnext: true,
                globals: {
                    exports: true,
                    Radar: true,
                    WeakMap: true,
                    copy: true
                }
            },
            files: {
                src: [
                    "Gruntfile.js",
                    "test/**/*.js",
                    "lib/**/*.js",
                ]
            },
        },
        jsbeautifier: {
            files: [
                "Gruntfile.js",
                "lib/**/*.js",
                "test/**/*.js"
            ],
            options: {
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        },

        watch: {
            src: {
                files: [
                    "Gruntfile.js",
                    "test/**/*.js",
                    "lib/**/*.js",
                ],
                tasks: ["default"],
                options: {
                    interrupt: true,
                },
            }
        },
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsbeautifier");

    // TODO Add code to use JSCS

    grunt.registerTask("default", ["jshint", "nodeunit"]);
    grunt.registerTask("beautify", ["jsbeautifier", "default"]);

};
