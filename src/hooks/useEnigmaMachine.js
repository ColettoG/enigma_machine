import { useState, useCallback } from 'react';
import { Enigma, RotorFactory, ReflectorFactory, Plugboard } from '../core';

const useEnigmaMachine = () => {
  const [rotorTypes, setRotorTypes] = useState(['I', 'II', 'III']);
  const [ringSettings, setRingSettings] = useState([0, 0, 0]);
  const [positions, setPositions] = useState([0, 0, 0]);
  const [reflectorType, setReflectorType] = useState('B');
  const [plugboardPairs, setPlugboardPairs] = useState([]);
  const [enigma, setEnigma] = useState(null);

  const initializeEnigma = useCallback(() => {
    const reflector = ReflectorFactory.createReflector(reflectorType);
    const leftRotor = RotorFactory.createRotor(rotorTypes[0], positions[0], ringSettings[0]);
    const middleRotor = RotorFactory.createRotor(rotorTypes[1], positions[1], ringSettings[1]);
    const rightRotor = RotorFactory.createRotor(rotorTypes[2], positions[2], ringSettings[2]);
    const plugboard = new Plugboard(plugboardPairs);

    const machine = new Enigma(reflector, leftRotor, middleRotor, rightRotor, plugboard);
    setEnigma(machine);
    return machine;
  }, [rotorTypes, ringSettings, positions, reflectorType, plugboardPairs]);

  const encipher = useCallback((char) => {
    const machine = initializeEnigma();
    const result = machine.encipher(char);

    const newPositions = machine.rotors.map(rotor => rotor.getPosition());
    setPositions(newPositions);

    return result;
  }, [initializeEnigma]);

  const updateRotorPositions = useCallback((newPositions) => {
    setPositions(newPositions);
  }, []);

  const updateRotorTypes = useCallback((newTypes) => {
    setRotorTypes(newTypes);
  }, []);

  const updateRingSettings = useCallback((newSettings) => {
    setRingSettings(newSettings);
  }, []);

  const updateReflector = useCallback((newReflector) => {
    setReflectorType(newReflector);
  }, []);

  const updatePlugboard = useCallback((newPairs) => {
    setPlugboardPairs(newPairs);
  }, []);

  const reset = useCallback(() => {
    setPositions([0, 0, 0]);
  }, []);

  return {
    rotorTypes,
    ringSettings,
    positions,
    reflectorType,
    plugboardPairs,
    encipher,
    updateRotorPositions,
    updateRotorTypes,
    updateRingSettings,
    updateReflector,
    updatePlugboard,
    reset,
  };
};

export default useEnigmaMachine;
