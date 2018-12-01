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

E->T|E+T;
T->F|T*F;
F->i|(E);

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
    outputPath: false,
    startSymbol: 'E',
  }

  const { productions, nonTerminator, terminator, first, follow, table } = translator(config);

  // all data export from `translator`
})()

```

### result

```bash

===== (1) start creating grammer =====
Grammer:
Terminal: +,*,i,(,)
NonTerminal: E,T,F
StartSymbol: E
ProductionFormula:
E->T|E+T;
T->F|T*F;
F->i|(E);
===== (1) completed =====

===== (2) start eliminating left recursion =====
Grammer:
Terminal: i,(,),*,~,+
NonTerminal: E,T,A,F,R
StartSymbol: E
ProductionFormula:
E->TA;
T->FR;
F->i|(E);
R->*FR|~;
A->+TA|~;
===== (2) completed =====

===== (3) start simplifying grammer =====
Grammer:
Terminal: i,(,),*,~,+
NonTerminal: E,T,A,F,R
StartSymbol: E
ProductionFormula:
E->TA;
T->FR;
F->i|(E);
R->*FR|~;
A->+TA|~;
===== (3) completed =====

===== (4) start extracting left common factor  =====
Grammer:
Terminal: i,(,),*,~,+
NonTerminal: E,T,A,F,R
StartSymbol: E
ProductionFormula:
E->TA;
T->FR;
F->i|(E);
R->*FR|~;
A->+TA|~;
===== (4) completed =====

===== (5) start generateFirsts  =====
Grammer:
Terminal: i,(,),*,~,+
NonTerminal: E,T,A,F,R
StartSymbol: E
ProductionFormula:
E->TA;
T->FR;
F->i|(E);
R->*FR|~;
A->+TA|~;
===== (5) completed =====

===== (6) start generateFollows  =====
Grammer:
Terminal: i,(,),*,~,+
NonTerminal: E,T,A,F,R
StartSymbol: E
ProductionFormula:
E->TA;
T->FR;
F->i|(E);
R->*FR|~;
A->+TA|~;
===== (6) completed =====

===== (7) start generateTable  =====
Grammer:
Terminal: i,(,),*,~,+
NonTerminal: E,T,A,F,R
StartSymbol: E
ProductionFormula:
E->TA;
T->FR;
F->i|(E);
R->*FR|~;
A->+TA|~;
===== (7) completed =====

===== !over! =====
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

#### inputPath [String] *required

The path where the grammar file is located

> tip: use 'path' package to resolve the relative path to absolute path;

#### displayProcess [Boolean]: true | false

Whether or not the translation process is displayed

The translator takes four steps to convert a non-ll1 grammar into LL1 grammar:

  1. Generating grammar from productions.
  2. Eliminatie left recursion.
  3. Simplify.
  4. Extracte left common factor.
  5. generateFirsts
  6. generateFollows
  7. generateTable

When you set this attribute to truthy, you'will see the every step result on the terminal.

#### outputPath [String | Boolean]: use false to disable it

The output path of the transformed grammar

#### startSymbol [Char]

A correct grammar requires a startSymbol. :)

## Issue

Welcome to submit issue on my Github

## Github

[https://github.com/wingsico](https://github.com/wingsico)
