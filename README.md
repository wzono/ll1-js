# ll1

ll(1) Grammer Analyzer

A LL1 grammar converter. The non-LL1 grammar is transformed into LL1 grammar by eliminating left recursion, simplifying and extracting left factors.

## Start

### Install

```bash
$ npm install ll1-js --save
```

### Usage

```js
const { translator } = require('ll1-js');
const path = require('path');

const inputPath = path.resolve(__dirname, './g.txt');

const ll1Produtions = translator({ inputPath });
```

## Config

### example
```js
{
  inputPath: '',
  displayProcess: false,
  outputPath: './output.txt',
  startSymbol: 'S',
}
```

### explain

#### inputPath

The path where the grammar file is located

> tip: use 'path' package to resolve the relative path to absolute path;

#### displayProcess

Whether or not the translation process is displayed

The translator takes four steps to convert a non-ll1 grammar into LL1 grammar:

  1. Generating grammar from productions.
  2. Eliminatie left recursion.
  3. Simplify.
  4. Extracte left common factor.

When you set this attribute to truthy, you'will see the every step result on the terminal.

#### outputPath

The output path of the transformed grammar

#### startSymbol

A correct grammar requires a startSymbol. :)


## Issue

Welcome to submit issue on my Github

## Github

[https://github.com/wingsico](https://github.com/wingsico)
