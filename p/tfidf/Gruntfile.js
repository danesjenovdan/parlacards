/*jslint node: true */
/*global module:false*/

'use strict';

//Using exclusion patterns slows down Grunt significantly
//instead of creating a set of patterns like '**/*.js' and '!**/node_modules/**'
//this method is used to create a set of inclusive patterns for all subdirectories
//skipping node_modules, bower_components, dist, and any .dirs
//This enables users to create any directory structure they desire.
var createFolderGlobs = function(fileTypePatterns) {
    fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
    var ignore = ['node_modules','bower_components','dist','temp', 'assets'];
    var fs = require('fs');
    return fs.readdirSync(process.cwd())
        .map(function(file){
            if (ignore.indexOf(file) !== -1 ||
                file.indexOf('.') === 0 ||
                !fs.lstatSync(file).isDirectory()) {
                return null;
            } else {
                return fileTypePatterns.map(function(pattern) {
                    return file + '/**/' + pattern;
                });
            }
        })
        .filter(function(patterns){
            return patterns;
        })
        .concat(fileTypePatterns);
};

module.exports = function(grunt) {

    var jsonData = JSON.parse(grunt.file.read('card/data.json'));
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-ejs');
    grunt.loadNpmTasks('grunt-open');

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        connect: {
            main: {
                options: {
                    port: 9001,
                    hostname:'0.0.0.0',
                    base: 'preview'
                }
            }
        },
        open : {
            dev : {
                path: 'http://127.0.0.1:9001/',
                app: 'Google Chrome'
            }
        },
        ejs: {
            all: {
                src: ['card/card.ejs'],
                dest: 'card/tmp',
                expand: true,
                ext: '.html',
                options:{data: jsonData}
            },
        },
        watch: {
            main: {
                options: {
                    livereload: true,
                    livereloadOnError: false,
                    spawn: false
                },
                files: [createFolderGlobs(['*.js','*.less','*.html','*.css','*.scss','*.ejs','*.json']),'!_SpecRunner.html','!.grunt'],
                tasks: ['reload_data','ejs','jshint','dom_munger:read','concat','uglify','sass','cssmin','read_script','read_css','dom_munger:update','htmlmin','clean:after'] //all the tasks are run dynamically during the watch event handler
            }
        },

        dom_munger:{
            read: {
                options: {
                    read:[
                        {selector:'script[data-concat!="false"]',attribute:'src',writeto:'appjs',isPath:true},
                        {selector:'link[rel="stylesheet"][data-concat!="false"]',attribute:'href',writeto:'appcss',isPath:true}
                    ]
                },
                src: 'card/card.ejs'
            },
            update: {
                options: {
                    remove: ['script[data-remove!="false"]','link[data-remove!="false"]'],
                    append: [
                        {selector:'body',html:'<script>'+'<%= read_script.data.script %>'+'</script>'},
                        {selector:'head',html:'<style rel="stylesheet">'+'<%= read_css.data.css %>'+'</style>'}
                    ]
                },
                src:'card/tmp/card/card.html',
                dest: 'preview/index.html'
            },
            updateBuild: {
                options: {
                    remove: ['script[data-remove!="false"]','link[data-remove!="false"]'],
                    append: [
                        {selector:'#min-script',html:'<%= read_script.data.script %>'},
                        {selector:'head',html:'<style rel="stylesheet">'+'<%= read_css.data.css %>'+'</style>'}
                    ]
                },
                src:'temp/card_ejs_body_removed.ejs',
                dest: 'temp/card.precompiled.ejs'
            }
/*            serveCompile: {
                options: {
                    prefix: [
                        {selector:'link[data-prefix="true"]',attribute:'href',value:'../card/'},
                        {selector:'script[data-prefix="true"]',attribute:'src',value:'../card/'}
                    ],
                },
                src: 'card/tmp/card/card.html',
                dest:'preview/index.html'
            },*/
        },
        sass: {
            dist: {
                files: {
                    'temp/main.css': 'card/scss/style.scss',
                    'card/scss/style.css': 'card/scss/style.scss'
                }
            }
        },
        concat: {
            main: {
                src: ['<%= dom_munger.data.appjs %>'],
                dest: 'temp/card.full.js'
            }
        },
        cssmin: {
            main: {
                src:['temp/main.css'],
                dest:'temp/card.full.min.css'
            }
        },
        uglify: {
            main: {
                src: 'temp/card.full.js',
                dest:'temp/card.full.min.js'
            }
        },
        htmlmin: {
            main: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                files: {
                    'dist/card.compiled.ejs': 'temp/card_ejs_before_minification.ejs'
                }
            }
        },
        /*copy: {
            main: {
                src: 'dist/index.html',
                dest: '../server/views/card.ejs'
            }
        },*/
        jshint: {
            main: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: createFolderGlobs('*.js')
            }
        },
        clean: {
            before:{
                src:['dist','temp']
            },
            after: {
                src:['temp','card/tmp']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.registerTask('read_script', 'do some stuff.', function() {

        var minifiedScript = grunt.file.read('temp/card.full.min.js');
        grunt.config(['read_script','data','script'],minifiedScript);

    });

    grunt.registerTask('wrap_ejs', 'do some stuff.', function() {

        var html = grunt.file.read('card/card.ejs');

        var replaced = html.replace(/<%([\w\W]*?)%>/g, function(match, subMatch){ return "<!-- <%"+subMatch+"%> -->"; });

        var fs = require('fs');
        var path = require('path');
        fs.writeFileSync(path.join(__dirname, '/temp/card_ejs_wrapped.ejs'), replaced);

        grunt.config(['wrap_ejs','data','wrapped_ejs'], replaced);

    });

    var bodyText;

    grunt.registerTask('body_grabber', 'do some stuff.', function() {


        var html = grunt.file.read('card/card.ejs');
        var fs = require('fs');
        var path = require('path');

        bodyText = html.match(/<body[^>]*>([^<]*(?:(?!<\/?body)<[^<]*)*)<\/body\s*>/i);

        var re = /<body[^>]*>([^<]*(?:(?!<\/?body)<[^<]*)*)<\/body\s*>/i;
        html = html.replace(re, '<body></body>');

        console.log(html);
        fs.writeFileSync('temp/card_ejs_body_removed.ejs', html);

        grunt.config(['body_grabber','data','body'], bodyText);

    });

    grunt.registerTask('body_replacer', 'do some stuff.', function() {

        var html = grunt.file.read('temp/card.precompiled.ejs');
        var fs = require('fs');
        var re = /<body[^>]*>([^<]*(?:(?!<\/?body)<[^<]*)*)<\/body\s*>/i;
        html = html.replace(re, bodyText[0]);

        fs.writeFileSync('temp/card_ejs_before_minification.ejs', html);

        grunt.config(['body_replacer','data','html'], html);

    });

    grunt.registerTask('reload_data', 'Reload json data', function() {

        jsonData = JSON.parse(grunt.file.read('card/data.json'));
        grunt.config(['ejs','all','options'], {data:jsonData});

    });

    grunt.registerTask('read_css', 'do some stuff.', function() {

        var minfiedCSS = grunt.file.read('temp/card.full.min.css');
        grunt.config(['read_css','data','css'],minfiedCSS);

    });

    // Default task.
    grunt.registerTask('build', ['jshint', 'body_grabber', 'dom_munger:read','concat','uglify','sass','cssmin','read_script','read_css','dom_munger:updateBuild','body_replacer','htmlmin'/*,'clean:after'*/]);
    grunt.registerTask('serve', ['jshint', 'ejs','dom_munger:read','concat','uglify','sass','cssmin','read_script','read_css','dom_munger:update','htmlmin','clean:after','connect','open:dev', 'watch']);

    //grunt.registerTask('serve', ['jshint', 'ejs', 'sass', 'dom_munger:serveCompile',,'connect', 'watch','clean:after']);

};
