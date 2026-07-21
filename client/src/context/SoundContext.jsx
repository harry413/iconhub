import { createContext, useContext, useEffect, useState } from 'react';
import { Howler } from 'howler';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('soundEnabled');
    setSoundEnabled(saved === null ? true : saved === 'true');
  }, []);

  useEffect(() => {
    Howler.mute(!soundEnabled);
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
