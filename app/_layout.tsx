import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { TodoItemProvider } from '@/contexts/TodoItemsContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });

  useEffect(() => {
   
  
      SplashScreen.hideAsync();
    
  }, []);


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <TodoItemProvider>
        
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* <Stack.Screen name="add_card" options={{ headerShown: true, headerBackTitle:"Back", headerTitle:"Add Card" }} /> */}
        <Stack.Screen name="+not-found" />
      </Stack>
      </TodoItemProvider>
    
    </ThemeProvider>
  );
}
