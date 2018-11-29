const path = require('path');
const filePath = path.resolve(__dirname, './g.txt');
const { translator, utils, Grammer } = require('../index');
(() => {
  const config = {
    displayProcess: true,
    inputPath: filePath,
    outputPath: './output.txt',
    startSymbol: 'S',
  }

  const ll1Produtions = translator(config);
  console.log(utils, Grammer)
})()
