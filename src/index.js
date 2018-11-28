const fs = require('fs');
const path = require('path');
const Grammer = require('./class/Grammer');
const { formatGsString, formatGsArray } = require('./utils');
const removeLeftRecursion = require('./components/removeLeftRecursion');
const removeLeftDivisor = require('./components/removeLeftDivisor');
const simplify = require('./components/simplify');

const filePath = path.resolve(__dirname, './g.txt');



(async () => {
  const gs = formatGsArray(formatGsString(fs.readFileSync(filePath, 'utf-8')));
  const grammer = new Grammer("S", gs);
  removeLeftRecursion(grammer);
  simplify(grammer);
  removeLeftDivisor(grammer);
  console.log(grammer)
})()
