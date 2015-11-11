#!/usr/bin/env node

'use strict';

var fs = require('fs'),
	path = require('path'),
    minimist = require('minimist'),
    iconv = require('iconv-lite');

var iconv_cli = {
    convert: function( infile, outfile, inencoding, outencoding ) {
        var inpath = path.resolve( infile );
        if (! fs.existsSync(inpath)) {
            echo('input file not found: ' + inpath);
            return;
        }
      
        var outpath = path.resolve( outfile );
    },
    main: function( argv ) {
        var cli = argv[1];
        var args = minimist( argv.slice(2) );
        
        var infile, outfile, inencoding, outencoding;
        if(args._.length > 0) {
            infile = args._[0];
            outfile = args._[1];
            inencoding = (args.i) ? args.i : 'utf8';
            outencoding = (args.o) ? args.o : 'utf8';
        }
      
        if(infile && outfile) {
            this.convert(infile, outfile, inencoding, outencoding);
        } else {
            echo('Arguments missing. \n' + 
                 'Syntax: charset-convert <in file> <out file> -i <in encoding> -o <out encoding>\n' + 
                 'Example: charset-convert ./demo-gb2312.txt ./demo-utf8.txt -i gb2312 -o utf8\n');
        }
    }
};

iconv_cli.main( process.argv );

    

