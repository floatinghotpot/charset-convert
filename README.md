# charset-convert #

Command line utility to convert text file from one charset to another.

# Dependency

* node.js, npm
* iconv-lite (auto installed as dependency)

# Install

```bash
[sudo] npm install -g charset-convert
```

# How To Use #

```bash
charset-convert <in file> <out file> -i <in encoding> -o <out encoding>
```

Example:
```bash
charset-convert demo-gbk.txt demo-utf8.txt -i gbk -o utf8
```

# How It Works #

This CLI utility is implemented based on [iconv-lite](https://github.com/ashtuchkin/iconv-lite), a great charset decoding/encoding module for node.js

# Credits #

A simple tool created by Raymond Xie, to install IPA package with command line.

Any comments are welcome.
