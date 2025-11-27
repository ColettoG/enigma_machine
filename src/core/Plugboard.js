const ALPHABET_SIZE = 26;

class Plugboard {
  constructor(pairs = []) {
    this.mapping = this.buildMapping(pairs);
  }

  buildMapping(pairs) {
    const map = {};
    for (let i = 0; i < ALPHABET_SIZE; i++) {
      map[i] = i;
    }

    pairs.forEach(([charA, charB]) => {
      const indexA = this.charToInt(charA);
      const indexB = this.charToInt(charB);
      map[indexA] = indexB;
      map[indexB] = indexA;
    });

    return map;
  }

  charToInt(char) {
    return char.charCodeAt(0) - 65;
  }

  process(signal) {
    return this.mapping[signal];
  }

  setPairs(pairs) {
    this.mapping = this.buildMapping(pairs);
  }

  getPairs() {
    const pairs = [];
    const processed = new Set();

    Object.entries(this.mapping).forEach(([key, value]) => {
      const keyNum = parseInt(key);
      if (keyNum !== value && !processed.has(keyNum)) {
        pairs.push([
          String.fromCharCode(keyNum + 65),
          String.fromCharCode(value + 65)
        ]);
        processed.add(keyNum);
        processed.add(value);
      }
    });

    return pairs;
  }
}

export default Plugboard;
