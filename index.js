#!/usr/bin/env node

'use strict';

var fs = require('fs'),
  path = require('path'),
  minimist = require('minimist'),
  iconv = require('iconv-lite');

var iconv_cli = {
  convert: function( infile, outfile, inencoding, outencoding ) {
    var inpath = path.resolve( infile );
    var outpath = path.resolve( outfile );
    fs.readFile(inpath, function(err, data) {
      if (!err) {
        const outdata = iconv.encode(iconv.decode(data, inencoding), outencoding);
        fs.writeFile(outpath, outdata, function(err) {
          if (!err) {
            console.log('done.\n');
          }
        });
      } else {
        return console.log('input file not found: ' + inpath);
      }
    });

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
      console.log(
        'charset-convert, based on node.js / iconv-lite.\n' +
        'project url: https://github.com/floatinghotpot/charset-convert\n\n' +
        'Syntax: charset-convert <in file> <out file> -i <in encoding> -o <out encoding>\n' + 
        'Example: charset-convert demo-gbk.txt demo-utf8.txt -i gbk -o utf8\n\n' +
        'Supported encodings:\n' +
        '    utf8, ucs2 / utf16-le, ascii, binary, base64, hex, all node.js native encodings.\n' +
        '    utf16, utf16-be, utf-7, utf-7-imap, additional unicode encodings.\n' +
        '    Windows 125x family, ISO-8859 family, IBM/DOS codepages, Macintosh family, KOI8 family, all widespread singlebyte encodings, and aliases like "latin1", "us-ascii", etc.\n' +
        '    GBK, GB2312, GB18030, Big5, Shift_JIS, EUC-JP, CP932, CP936, CP949, CP950, all widespread multibyte encodings.\n' +
      '');
    }
  }
};

iconv_cli.main( process.argv );

    

