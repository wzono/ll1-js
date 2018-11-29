const Grammer = require('../class/Grammer');
const { shuffle, replaceLetter, container, randomNT } = require('../utils');
const { selectSeperator, productionSeperator, emptyChar } = require('../config');

function removeLeftRecursion(grammer = new Grammer("")) {
  const nonTerminator = shuffle([...grammer.getNonTerminator()]);
  const productions = grammer.getProductions();

  let finalProduction = [];
  let productionsKeeper = {};
  nonTerminator.forEach((n, i) => {
    let originProduction = productions[n]; // 需要被替换的产生式
    for (let j = 0; j < i; j++) {
      let $n = nonTerminator[j]; // 待替换的非终结符
      let currentProduction = productions[$n]; // 待替换的非终结符的产生式
      if (shouldReplaceLetter(currentProduction, nonTerminator)) {
        originProduction = replaceLetter(originProduction, $n, currentProduction)
      }
      productionsKeeper[n] = originProduction;
    }
    finalProduction[0] = n;
    finalProduction[1] = originProduction;
    const newProductions = removeDirectLeftRecursion(finalProduction, [...grammer.getNonTerminator()]);
    productionsKeeper = Object.assign(productionsKeeper, newProductions);
  })
  grammer.setProductions(Object.assign(productions, productionsKeeper));
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

function shouldReplaceLetter(right = "", nts = []) {
  return right.split(selectSeperator).filter(candidate => nts.includes(candidate.substr(0, 1))) > 0;
}

module.exports = removeLeftRecursion;
