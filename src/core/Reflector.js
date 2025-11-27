class Reflector {
  constructor(wiring) {
    this.wiring = this.parseWiring(wiring);
  }

  parseWiring(wiring) {
    return wiring.split('').map(char => this.charToInt(char));
  }

  charToInt(char) {
    return char.charCodeAt(0) - 65;
  }

  reflect(signal) {
    return this.wiring[signal];
  }
}

export default Reflector;
