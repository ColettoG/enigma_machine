const ALPHABET_SIZE = 26;

class Rotor {
  constructor(wiring, notch, position = 0, ringSetting = 0) {
    this.wiring = this.parseWiring(wiring);
    this.inverseWiring = this.buildInverseWiring();
    this.notch = this.charToInt(notch);
    this.position = position;
    this.ringSetting = ringSetting;
  }

  parseWiring(wiring) {
    return wiring.split('').map(char => this.charToInt(char));
  }

  buildInverseWiring() {
    const inverse = new Array(ALPHABET_SIZE);
    this.wiring.forEach((output, input) => {
      inverse[output] = input;
    });
    return inverse;
  }

  charToInt(char) {
    return char.charCodeAt(0) - 65;
  }

  intToChar(num) {
    return String.fromCharCode((num + ALPHABET_SIZE) % ALPHABET_SIZE + 65);
  }

  step() {
    this.position = (this.position + 1) % ALPHABET_SIZE;
  }

  isAtNotch() {
    return this.position === this.notch;
  }

  forward(signal) {
    const offset = this.position - this.ringSetting;
    const entry = (signal + offset + ALPHABET_SIZE) % ALPHABET_SIZE;
    const encoded = this.wiring[entry];
    return (encoded - offset + ALPHABET_SIZE) % ALPHABET_SIZE;
  }

  backward(signal) {
    const offset = this.position - this.ringSetting;
    const entry = (signal + offset + ALPHABET_SIZE) % ALPHABET_SIZE;
    const encoded = this.inverseWiring[entry];
    return (encoded - offset + ALPHABET_SIZE) % ALPHABET_SIZE;
  }

  rotateTo(position) {
    this.position = position % ALPHABET_SIZE;
  }

  setRingSetting(setting) {
    this.ringSetting = setting % ALPHABET_SIZE;
  }

  getPosition() {
    return this.position;
  }
}

export default Rotor;
