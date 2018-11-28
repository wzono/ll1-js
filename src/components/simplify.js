const Grammer = require('../class/Grammer');
const { pick, getNonTerminatorFromProduction } = require('../utils');

function simplify(grammer = new Grammer()) {
  const startSymbol = grammer.getStartSymbol();
  const productions = grammer.getProductions();
  const nts = [...grammer.getNonTerminator()];
  const used = {}

  dfs(used, startSymbol, productions, nts);

  const newProductions = pick(productions, Object.keys(used));

  grammer.setProductions(newProductions);
}

function dfs(used, symbol, productions, nts) {
  used[symbol] = true;
  const _nts = getNonTerminatorFromProduction(productions[symbol], nts);
  if (_nts.length === 1 && _nts[0] === symbol || _nts.length === 0) {
    return;
  }
  _nts.forEach(nt => {
    dfs(used, nt, productions, nts)
  })
}

module.exports = simplify
