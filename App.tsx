import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './src/context/SettingsContext';
import { AudioProvider } from './src/context/AudioContext';
import { GameProvider, useGame } from './src/context/GameContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';

type ActiveScreen = 'home' | 'game';

const NavigationContainer: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const { startGame } = useGame();

  const handleStartGame = () => {
    startGame();
    setCurrentScreen('game');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  return currentScreen === 'home' ? (
    <HomeScreen onStartGame={handleStartGame} />
  ) : (
    <GameScreen onGoHome={handleGoHome} />
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AudioProvider>
          <GameProvider>
            <NavigationContainer />
          </GameProvider>
        </AudioProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
