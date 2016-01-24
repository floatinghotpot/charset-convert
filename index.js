#!/usr/bin/env node

'use strict';

var fs = require('fs'),
  path = require('path'),
  walk = require('walk'),
  minimist = require('minimist'),
  iconv = require('iconv-lite');

function convert_file( infile, outfile, inencoding, outencoding, callback ) {
  var inpath = path.resolve( infile );
  var outpath = path.resolve( outfile );
  fs.readFile(inpath, function(err, data) {
    if (!err) {
      const outdata = iconv.encode(iconv.decode(data, inencoding), outencoding);
      fs.writeFile(outpath, outdata, function(err) {
        if (!err) {
          if(callback && typeof callback === 'function') return callback(1);
        }
      });
    } else {
      return console.log('input file not found: ' + inpath);
    }
  });
};

function convert_dir( in_dir, out_dir, inencoding, outencoding, callback ) {
  var n = 0;
  var walker = walk.walk(in_dir, { followLinks: false, filters: ['.git'] });
  walker.on('directory', function(root, stat, next) {
    var newdir = out_dir + (root + '/' + stat.name).substring(in_dir.length);
    console.log(newdir);
    try {
      fs.mkdirSync(newdir);
    } catch(e) {
      console.log('error making dir');
    }
    next();
  });
  walker.on('file', function(root, stat, next) {
    var oldfile = root + '/' + stat.name;
    var newfile = out_dir + oldfile.substring(in_dir.length);
    convert_file(oldfile, newfile, inencoding, outencoding, function(){
      console.log(newfile);
      n ++;
      next();
    });
  });
  walker.on('end', function(){
    if(callback && typeof callback === 'function') return callback(n);
  });
};

function show_syntax() {
  console.log(
    'Syntax: charset-convert <in file> <out file> -i <in encoding> -o <out encoding>\n' + 
    'Examples: \n' +
    'charset-convert file-gbk.txt file-utf8.txt -i gbk -o utf8\n' +
    'charset-convert folder-big5 folder-utf8 -i gbk -o utf8\n\n' +
    'Supported encodings:\n' +
    '    utf8, ucs2 / utf16-le, ascii, binary, base64, hex, all node.js native encodings.\n' +
    '    utf16, utf16-be, utf-7, utf-7-imap, additional unicode encodings.\n' +
    '    Windows 125x family, ISO-8859 family, IBM/DOS codepages, Macintosh family, KOI8 family, all widespread singlebyte encodings, and aliases like "latin1", "us-ascii", etc.\n' +
    '    GBK, GB2312, GB18030, Big5, Shift_JIS, EUC-JP, CP932, CP936, CP949, CP950, all widespread multibyte encodings.\n' +
    '\n' +
    'project url: https://github.com/floatinghotpot/charset-convert\n\n' +
  '');
}

function main( argv ) {
  var cli = argv[1];
  var args = minimist( argv.slice(2) );

  var infile, outfile, inencoding, outencoding;
  if(args._.length >= 2) {
    infile = args._[0];
    outfile = args._[1];
    inencoding = (args.i) ? args.i : 'utf8';
    outencoding = (args.o) ? args.o : 'utf8';
  } else {
    return show_syntax();
  }

  fs.stat(outfile, function(errOut, statOut) {
    if(! errOut) {
      return console.log('Error: ' + outfile + ' exists. \nPlease remove it, or give a new dest path.\n');
    }
    fs.stat(infile, function(errIn, statIn) {
      var show_done = function(n) {
        console.log('Done, ' + n + ' files converted from ' + inencoding + ' to ' + outencoding +'.\n');
      }
      if(statIn.isFile()) {
        convert_file(infile, outfile, inencoding, outencoding, show_done);
      } else if(statIn.isDirectory()) {
        fs.mkdirSync(outfile);
        convert_dir(infile, outfile, inencoding, outencoding, show_done);
      } else {
        console.log('error');
      }
    });
  });
}

main( process.argv );

    

