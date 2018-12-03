const Grammar = require('../class/Grammar');
const { pick, getNonTerminatorFromProduction } = require('../utils');

function simplify(grammar = new Grammar()) {
  const startSymbol = grammar.getStartSymbol();
  const productions = grammar.getProductions();
  const nts = [...grammar.getNonTerminator()];
  const used = {}

  dfs(used, startSymbol, productions, nts);

  const newProductions = pick(productions, Object.keys(used));

  grammar.setProductions(newProductions);
}

function dfs(used, symbol, productions, nts) {
  if (used[symbol]) {
    return;
  }
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
