import Reflector from './Reflector';

const REFLECTOR_CONFIGURATIONS = {
  B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
};

class ReflectorFactory {
  static createReflector(type) {
    const wiring = REFLECTOR_CONFIGURATIONS[type];
    if (!wiring) {
      throw new Error(`Unknown reflector type: ${type}`);
    }
    return new Reflector(wiring);
  }

  static getAvailableReflectors() {
    return Object.keys(REFLECTOR_CONFIGURATIONS);
  }

  static getConfiguration(type) {
    return REFLECTOR_CONFIGURATIONS[type];
  }
}

export default ReflectorFactory;
