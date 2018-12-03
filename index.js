const fs = require('fs');
const path = require('path');
const Grammar = require('./lib/class/Grammar');
const utils = require('./lib/utils');
const removeLeftRecursion = require('./lib/components/removeLeftRecursion');
const removeLeftDivisor = require('./lib/components/removeLeftDivisor');
const simplify = require('./lib/components/simplify');

function checkoutConfig(config = {}) {
  if (!config.inputPath) {
    throw new Error("lack of required config attributes: inputPath")
  }
}

const { formatGsArray, formatGsString, formatOutputGrammar, formatOutputProdutions } = utils;
const { emptyChar } = require('./lib/config');

(() => {
  exports.translator = function (customConfig = {}) {
    const config = Object.assign({
      inputPath: '',
      displayProcess: false,
      outputPath: './output.txt',
      startSymbol: 'S',
    }, customConfig);

    checkoutConfig(config);

    const { inputPath, displayProcess, outputPath, startSymbol } = config;

    const gs = formatGsArray(formatGsString(fs.readFileSync(inputPath, 'utf-8')));

    const grammar = new Grammar(startSymbol, gs);
    if (displayProcess) {
      console.log('===== (1) start creating grammar =====');
      formatOutputGrammar(grammar);
      console.log('===== (1) completed =====\n');
      console.log('===== (2) start eliminating left recursion =====');
      removeLeftRecursion(grammar);
      formatOutputGrammar(grammar);
      console.log('===== (2) completed =====\n');
      console.log('===== (3) start simplifying grammar =====');
      simplify(grammar);
      formatOutputGrammar(grammar);
      console.log('===== (3) completed =====\n');
      console.log('===== (4) start extracting left common factor  =====')
      removeLeftDivisor(grammar);
      formatOutputGrammar(grammar);
      console.log('===== (4) completed =====\n');
      console.log('===== (5) start generateFirsts  =====')
      grammar.generateFirsts();
      formatOutputGrammar(grammar);
      console.log('===== (5) completed =====\n');
      console.log('===== (6) start generateFollows  =====')
      grammar.generateFollows();
      formatOutputGrammar(grammar);
      console.log('===== (6) completed =====\n');
      console.log('===== (7) start generateTable  =====')
      grammar.generateTable();
      console.log(grammar)
      formatOutputGrammar(grammar);
      console.log('===== (7) completed =====\n');
      console.log('===== !over! =====\n');
    } else {
      removeLeftRecursion(grammar);
      simplify(grammar);
      removeLeftDivisor(grammar);
      grammar.generateFirsts();
      grammar.generateFollows();
      grammar.generateTable();
    }

    const productions = grammar.getProductions();
    const first = grammar.getFirst();
    const follow = grammar.getFollow();
    const table = grammar.getTable();
    const nonTerminator = grammar.getNonTerminator();
    const terminator = grammar.getTerminator();
    const inputStopSymbol = grammar.getInputStopSymbol();

    if (!!outputPath) {
      fs.writeFileSync(outputPath, Object.keys(productions).map(key => `${key}->${productions[key]};`).join("\n"));
    }

    return {
      productions,
      first,
      follow,
      table,
      nonTerminator,
      terminator,
      inputStopSymbol,
      startSymbol,
      emptyChar,
    };
  }

  exports.utils = utils;
  exports.Grammar = Grammar;
})()
