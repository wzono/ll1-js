const { selectSeperator, derivationSeperator, emptyChar } = require('../config');
const Grammer = require('../class/Grammer')


function splitLetters(letters = "") {
  return letters.split("").reduce((acc, cur) => {
    isUpperCase(cur) && acc[0].add(cur);
    (!isUpperCase(cur) && cur !== selectSeperator) && acc[1].add(cur);
    return acc;
  }, [new Set(), new Set()])
}

function isUpperCase(c) {
  return /[A-Z]/.test(c);
}

function isIterater(obj) {
  return typeof obj[Symbol.iterator] === 'function';
}

function formatOutputProdutions(productions = {}) {
  console.log("ProductionFormula: ");
  Object.keys(productions).forEach(left => {
    console.log(`${left}->${productions[left]};`)
  })
}

function formatOutputGrammer(grammer = new Grammer()) {
  console.log(`Grammer: `)
  console.log(`Terminal: ${[...grammer.getTerminator()].toString()}`)
  console.log(`NonTerminal: ${[...grammer.getNonTerminator()].toString()}`)
  console.log(`StartSymbol: ${grammer.getStartSymbol().toString()}`)
  formatOutputProdutions(grammer.getProductions());
}

/**
 *
 * @param {String} production 需要被替换的产生式右部
 * @param {String} n  需要被替换的旧字符串
 * @param {String} nProduction 需要替换成的新字符串
 */
function replaceLetter(production = "", n = "", nProduction = "") {
  if (!container(production, n)) {
    return production;
  }

  return production.split(selectSeperator).map(p => {
    if (!container(p, n)) {
      return p;
    }

    return nProduction.split(selectSeperator).map(np => {
      return p.replace(n, np)
    }).join(selectSeperator)
  }).join(selectSeperator)
}

function container(str = "", char = "") {
  return [...str].includes(char);
}

function getNonTerminatorFromProduction(productionRight = "", nts = []) {
  const _nts = [...nts];
  return _nts.sort((a, b) => b.length - a.length).filter(nt => {
    const found = new RegExp(nt).test(productionRight);
    productionRight = productionRight.split(nt).join("")
    return found;
  });
}


function pick(obj, pickers = []) {
  return Object.keys(obj).reduce((acc, cur) => {
    return pickers.includes(cur) ? {
      ...acc,
      [cur]: obj[cur],
    } : acc;
  }, {})
}

/**
 * 求差集，在集合a中不在集合b中
 * @param {Array} a 被差集
 * @param {Array} b 差集
 */
function difference(a, b) {
  return a.filter(v => a.includes(v) && !b.includes(v));
}

function shuffle(arr = []) {
  let temp;
  let cloneArr = [...arr];
  for (let i = cloneArr.length - 1; i >= 0; i--) {
    const rd = Math.floor(Math.random() * cloneArr.length);
    temp = cloneArr[i];
    cloneArr[i] = cloneArr[rd];
    cloneArr[rd] = temp;
  }
  return cloneArr;
}

function formatGsString(gs = "") {
  return gs.split(';').map(g => g.trim()).filter(g => g);
}

function formatGsArray(P = []) {
  const separator = derivationSeperator
  const productions = {};
  P.forEach(p => {
    const [left, right] = p.split(separator);
    const [key, value] = [left.trim(), right.trim()];
    if (productions[key]) {
      productions[key] = `${productions[key]}${selectSeperator}${value}`;
      return;
    }
    productions[key] = value;
  })

  return productions;
}

const nts = Array.from(new Array(26), (v, k) => k + 65).map(code => String.fromCharCode(code));
function randomNT(exclude = []) {
  const remain = difference(nts, exclude);
  return remain[Math.floor(Math.random() * remain.length)];
}

function productionsIncludeNT(nt = "", productions = {}) {
  return Object.keys(productions).reduce((acc, key) => {
    productions[key].split("|").forEach(p => acc.push([key, p]))

    return acc;
  }, []).filter(p => p[1].split("").includes(nt));
}

function union(a = [], b = []) {
  return [...new Set([...a, ...b])];
}

module.exports = {
  splitLetters,
  isIterater,
  replaceLetter,
  container,
  getNonTerminatorFromProduction,
  shuffle,
  pick,
  formatGsString,
  formatGsArray,
  difference,
  randomNT,
  formatOutputProdutions,
  formatOutputGrammer,
  productionsIncludeNT,
  union
}
