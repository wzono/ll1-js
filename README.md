# ll1

ll(1) Grammer Analyzer

A LL1 grammar converter. The non-LL1 grammar is transformed into LL1 grammar by eliminating left recursion, simplifying and extracting left factors.

## Start

### Install

```bash
$ npm install ll1-js --save
```

### Usage

```js
const { translator } = require('ll1-js');
const path = require('path');

const inputPath = path.resolve(__dirname, './g.txt');

const ll1Produtions = translator({ inputPath });
```

### Example

### code

```js
// g.txt

S->Qc|c|cab;
Q->Rb|b;
R->Sa|a;
```

```js
// ./test/index.js

const path = require('path');
const filePath = path.resolve(__dirname, './g.txt');
const { translator, Grammer, utils } = require('../index');
(() => {
  const config = {
    displayProcess: true,
    inputPath: filePath,
    outputPath: './output.txt',
    startSymbol: 'S',
  }
  const { productions, grammer } = translator(config);
})()
```

### result

```bash
===== (1) start creating grammer =====
Grammer:
Terminal: c,a,b
NonTerminal: S,Q,R
StartSymbol: S
ProductionFormula:
S->Qc|c|cab;
Q->Rb|b;
R->Sa|a;
===== (1) completed =====

===== (2) start eliminating left recursion =====
Grammer:
Terminal: c,a,b,~
NonTerminal: S,Q,D,R
StartSymbol: S
ProductionFormula:
S->Qc|c|cab;
Q->cabD|cababD|abD|bD;
R->Qca|ca|caba|a;
D->cabD|~;
===== (2) completed =====

===== (3) start simplifying grammer =====
Grammer:
Terminal: c,a,b,~
NonTerminal: S,Q,D
StartSymbol: S
ProductionFormula:
S->Qc|c|cab;
Q->cabD|cababD|abD|bD;
D->cabD|~;
===== (3) completed =====

===== (4) start extracting left common factor  =====
Grammer:
Terminal: c,~,a,b
NonTerminal: S,Q,U,D,I
StartSymbol: S
ProductionFormula:
S->Qc|cU;
U->~|ab;
Q->abD|bD|caI;
I->bD|babD;
D->cabD|~;
===== (4) completed =====
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
