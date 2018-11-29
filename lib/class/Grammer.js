const {
  splitLetters,
  formatGsArray,
} = require('../utils');

class Grammer {
  constructor(S = "", P = {}) {
    this.N = new Set(); // 非终结符
    this.T = new Set(); // 终结符
    this.S = S; // 开始符号

    this.P = P; // 产生式集合

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
