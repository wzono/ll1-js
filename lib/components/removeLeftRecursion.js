const Grammar = require('../class/Grammar');
const { shuffle, replaceLetter, container, randomNT } = require('../utils');
const { selectSeperator, emptyChar } = require('../config');

function removeLeftRecursion(grammar = new Grammar("")) {
  // 将非终结符按照一定顺序排列，这里采取乱序排列(但保证开始符号为第一行)
  const nonTerminator = shuffle([...grammar.getNonTerminator()]);
  const productions = grammar.getProductions();

  let finalProduction = [];
  // 产生式保持器，防止在过程中改变产生式，将新的产生保存到这里，到最后再统一更新
  let productionsKeeper = Object.assign({}, productions);
  for (let i = 0; i < nonTerminator.length; i++) {
    let n = nonTerminator[i];
    let originProduction = productionsKeeper[n]; // 需要被替换的产生式
    for (let j = 0; j < i; j++) {
      let $n = nonTerminator[j]; // 待替换的非终结符
      let currentProduction = productionsKeeper[$n]; // 待替换的非终结符的产生式
      // 如果不是形如 Pi -> Pjγ 这种规则是不需要替换的，进行判断防止出错。
      if (shouldReplaceLetter(originProduction, $n)) {
        originProduction = replaceLetter(originProduction, $n, currentProduction)
      }
      productionsKeeper[n] = originProduction;
    }
    finalProduction[0] = n;
    finalProduction[1] = originProduction;
    // 消除直接左递归
    const newProductions = removeDirectLeftRecursion(finalProduction, Object.keys(productionsKeeper));
    Object.assign(productionsKeeper, newProductions);
  }
  // 更新产生式
  grammar.setProductions(productionsKeeper);
}

function removeDirectLeftRecursion(production = [], nts = []) {
  const left = production[0];
  const right = production[1];
  if (!shouldRemoveDirectLeftRecursion(left, right)) {
    return {
      [left]: right,
    }
  }

  const newLeft = randomNT(nts);

  const productions = {};

  const [replaceCandiates, appendCandidates] = right.split(selectSeperator).reduce((acc, cur) => {
    container(cur, left) ? acc[0].push(cur) : acc[1].push(cur);
    return acc;
  }, [[], []]);

  productions[left] = appendCandidates.map(appendCandidate => `${appendCandidate}${newLeft}`).join(selectSeperator);
  productions[newLeft] = replaceCandiates.map(replaceCandiate => replaceCandiate.split(left).join("") + newLeft).join(selectSeperator) + selectSeperator + emptyChar; // 添加终结符 ~ 表示空

  return productions;
}

function shouldRemoveDirectLeftRecursion(left = "", right = "") {
  const candidates = right.split(selectSeperator);
  return candidates.filter(candidate => candidate.substr(0, 1) === left).length !== 0;
}

function shouldReplaceLetter(originRight, left) {
  return originRight.split(selectSeperator).filter(candidate => candidate.substr(0, 1) === left).length > 0;
}

module.exports = removeLeftRecursion;
