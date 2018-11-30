const path = require('path');
const filePath = path.resolve(__dirname, './g.txt');
const { translator, utils, Grammer } = require('../index');
(() => {
  const config = {
    displayProcess: false,
    inputPath: filePath,
    outputPath: false,
    startSymbol: 'E',
  }

  /**
   * productions ll1-producations
   * grammer ll1-grammer
   */
  const { productions, grammer } = translator(config);
  console.log(grammer)
})()
