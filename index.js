const fs = require('fs');
const path = require('path');
const Grammer = require('./lib/class/Grammer');
const utils = require('./lib/utils');
const removeLeftRecursion = require('./lib/components/removeLeftRecursion');
const removeLeftDivisor = require('./lib/components/removeLeftDivisor');
const simplify = require('./lib/components/simplify');

function checkoutConfig(config = {}) {
  if (!config.inputPath) {
    throw new Error("lack of required config attributes: inputPath")
  }
}

const { formatGsArray, formatGsString, formatOutputGrammer, formatOutputProdutions} = utils;

(async () => {
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

    const grammer = new Grammer(startSymbol, gs);
    if (displayProcess) {
      console.log('===== (1) start creating grammer =====');
      formatOutputGrammer(grammer);
      console.log('===== (1) completed =====\n');
      console.log('===== (2) start eliminating left recursion =====');
      removeLeftRecursion(grammer);
      formatOutputGrammer(grammer);
      console.log('===== (2) completed =====\n');
      console.log('===== (3) start simplifying grammer =====');
      simplify(grammer);
      formatOutputGrammer(grammer);
      console.log('===== (3) completed =====\n');
      console.log('===== (4) start extracting left common factor  =====')
      removeLeftDivisor(grammer);
      formatOutputGrammer(grammer);
      console.log('===== (4) completed =====\n');
    } else {
      removeLeftRecursion(grammer);
      simplify(grammer);
      removeLeftDivisor(grammer);
    }

    const productions = grammer.getProductions();
    if (!!outputPath) {
      fs.writeFileSync(outputPath, Object.keys(productions).map(key => `${key}->${productions[key]};`).join("\n"));
    }

    return productions;
  }

  exports.utils = utils;
  exports.Grammer = Grammer;
})()
