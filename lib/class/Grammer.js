const {
  splitLetters,
  formatGsArray,
  productionsIncludeNT
} = require('../utils');

const {
  selectSeperator,
  emptyChar,
  errorSymbol
} = require('../config')

class Grammer {
  constructor(S = "", P = {}, E = '#') {
    this.N = new Set(); // 非终结符
    this.T = new Set(); // 终结符
    this.S = S; // 开始符号

    this.P = P; // 产生式集合

    this.first = {}; // First 集合
    this.follow = {}; // Follow 集合

    this.table = {}; // 预测分析表

    this.E = E; // 输入串结束符

    this.generate();
    this.checkout();
  }

  generate() {
    this.N = new Set();
    this.T = new Set();

    const productions = this.P;
    Object.keys(productions).forEach((N,index) => {
      const [left, right] = [N, productions[N]];
      const rightLetters = splitLetters(right);
      const rightN = rightLetters[0];
      const rightT = rightLetters[1];

      this.addNonTerminator([left, ...rightN]);
      this.addTerminator([...rightT]);

      if (index === 0 && this.S === "") {
        this.S = left;
      }
    })
  }

  checkout() {
    if (![...this.N].includes(this.S)) {
      throw new Error(`startSymbolMissing: can't find the startSymbol(${this.S} in the input file.)`)
    }
  }

  generateFirsts() {
    this.T.forEach(t => this.first[t] = new Set([t]));
    this.N.forEach(nt => {
      this.first[nt] = new Set();
    })

    while (this.emptyFirstNonTerminator().length !== 0) {
      this.generateFirst(this.emptyFirstNonTerminator()[0]);
    }
  }

  generateFirst(nt = "") {
    const production = this.P[nt];
    const candidates = production.split(selectSeperator);

    candidates.forEach((candidate = "") => {
      const rightFirstChar = candidate.substr(0, 1);
      if ([...this.T].includes(rightFirstChar)) {
        this.first[nt].add(rightFirstChar);
      } else {
        const childFirst = [...this.generateFirst(rightFirstChar)];
        childFirst.forEach(t => this.first[nt].add(t));
      }
    })

    return this.first[nt]
  }

  generateFollows() {
    this.N.forEach(nt => {
      this.follow[nt] = new Set();
    });

    while (this.emptyFollowNonTerminator().length !== 0) {
      this.generateFollow(this.emptyFollowNonTerminator()[0]);
    }
  }

  generateFollow(nt = "") {
    nt === this.S && this.follow[nt].add(this.E);
    const produtions = productionsIncludeNT(nt, this.P);
    produtions.forEach(prodution => {
      const [left, right] = prodution;
      const charAfterNT = right[right.indexOf(nt) + 1];
      if (right.slice(-1) === nt && left === nt) {
        return;
      }

      if ([...this.T].includes(charAfterNT)) {
        this.follow[nt].add(charAfterNT);
      }

      if (right.slice(-1) !== nt) {
        const first = this.first[charAfterNT];
        [...first].filter(t => t !== emptyChar).forEach(t => this.follow[nt].add(t));
      }

      if ((right.slice(-1) === nt) || ([...this.first[charAfterNT]].includes(emptyChar))) {
        const follow = this.generateFollow(left)
        follow.forEach(t => this.follow[nt].add(t))
      }
    })
    return this.follow[nt];
  }

  emptyFirstNonTerminator() {
    return [...this.N].filter(key => this.first[key].size === 0);
  }

  emptyFollowNonTerminator() {
    return [...this.N].filter(key => this.follow[key].size === 0);
  }

  generateTable() {
    const resolvedProdutions = Object.keys(this.P).reduce((acc, key) => {
      this.P[key].split(selectSeperator).forEach(p => acc.push([key, p]))
      return acc;
    }, [])

    const ts = [...[...this.T].filter(t => t !== emptyChar), this.E];

    this.N.forEach(nt => this.table[nt] = ts.reduce((acc, key) => {
      acc[key] = errorSymbol;
      return acc;
    }, {}));

    resolvedProdutions.forEach(([left = "", right = ""]) => {
      const first = this.first[right.substr(0, 1)];

      ts.filter(t => [...first].includes(t)).forEach(t => this.table[left][t] = [left, right]);

      if ([...first].includes(emptyChar)) {
        const follow = this.follow[left];
        follow.forEach(t => this.table[left][t] = [left, right]);
      }
    })
  }

  addNonTerminator(N = []) {
    N.forEach(n => this.N.add(n));
  }

  addTerminator(T = []) {
    T.forEach(t => this.T.add(t));
  }

  getTerminator() {
    return this.T;
  }

  getNonTerminator() {
    return this.N;
  }

  getProductions() {
    return this.P;
  }

  getStartSymbol() {
    return this.S;
  }

  setProductions(productions = {}) {
    this.P = productions;
    this.generate();
  }


}

module.exports = Grammer;
