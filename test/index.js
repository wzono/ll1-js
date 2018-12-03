const path = require('path');
const filePath = path.resolve(__dirname, './g.txt');
const { translator, utils, Grammar } = require('../index');
(() => {
  const config = {
    displayProcess: true,
    inputPath: filePath,
    outputPath: false,
    startSymbol: 'E',
  }

  /**
   * productions ll1-producations
   * grammar ll1-grammar
   */
  const { productions, nonTerminator, terminator, first, follow, table, inputStopSymbol, startSymbol, emptyChar } = translator(config);
})()
