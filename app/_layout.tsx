import '~/global.css';

import { Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NAV_THEME } from '~/lib/constants';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  React.useEffect(() => {
      SplashScreen.hideAsync();
  }, []);


  return (
    <ThemeProvider value={LIGHT_THEME}>
      <StatusBar />
      <Stack />
    </ThemeProvider>
  );
}