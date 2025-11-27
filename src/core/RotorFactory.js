import Rotor from './Rotor';

const ROTOR_CONFIGURATIONS = {
  I: { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  II: { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  III: { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  IV: { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  V: { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
};

class RotorFactory {
  static createRotor(type, position = 0, ringSetting = 0) {
    const config = ROTOR_CONFIGURATIONS[type];
    if (!config) {
      throw new Error(`Unknown rotor type: ${type}`);
    }
    return new Rotor(config.wiring, config.notch, position, ringSetting);
  }

  static getAvailableRotors() {
    return Object.keys(ROTOR_CONFIGURATIONS);
  }

  static getConfiguration(type) {
    return ROTOR_CONFIGURATIONS[type];
  }
}

export default RotorFactory;
