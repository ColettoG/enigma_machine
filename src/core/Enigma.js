class Enigma {
  constructor(reflector, leftRotor, middleRotor, rightRotor, plugboard) {
    this.reflector = reflector;
    this.rotors = [leftRotor, middleRotor, rightRotor];
    this.plugboard = plugboard;
  }

  charToInt(char) {
    return char.charCodeAt(0) - 65;
  }

  intToChar(num) {
    return String.fromCharCode((num + 26) % 26 + 65);
  }

  setRotorPositions(positions) {
    positions.forEach((position, index) => {
      if (this.rotors[index]) {
        this.rotors[index].rotateTo(position);
      }
    });
  }

  setRotors(rotors) {
    if (rotors.length === 3) {
      this.rotors = rotors;
    }
  }

  stepRotors() {
    const [leftRotor, middleRotor, rightRotor] = this.rotors;

    const middleAtNotch = middleRotor.isAtNotch();
    const rightAtNotch = rightRotor.isAtNotch();

    if (middleAtNotch) {
      leftRotor.step();
      middleRotor.step();
    } else if (rightAtNotch) {
      middleRotor.step();
    }

    rightRotor.step();
  }

  encipher(char) {
    const upperChar = char.toUpperCase();

    if (!/[A-Z]/.test(upperChar)) {
      return char;
    }

    this.stepRotors();

    let signal = this.charToInt(upperChar);

    signal = this.plugboard.process(signal);

    signal = this.rotors[2].forward(signal);
    signal = this.rotors[1].forward(signal);
    signal = this.rotors[0].forward(signal);

    signal = this.reflector.reflect(signal);

    signal = this.rotors[0].backward(signal);
    signal = this.rotors[1].backward(signal);
    signal = this.rotors[2].backward(signal);

    signal = this.plugboard.process(signal);

    return this.intToChar(signal);
  }

  encipherText(text) {
    return text.split('').map(char => this.encipher(char)).join('');
  }

  reset() {
    this.rotors.forEach(rotor => rotor.rotateTo(0));
  }
}

export default Enigma;
