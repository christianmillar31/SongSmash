import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'styled-components/native';
import TeamsScreen from '../src/screens/TeamsScreen';
import DifficultyScreen from '../src/screens/DifficultyScreen';
import GenreScreen from '../src/screens/GenreScreen';
import GameScreen from '../src/screens/GameScreen';
import { TeamProvider } from '../src/context/TeamContext';
import theme from '../src/theme';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings</Text>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <TeamProvider>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Teams">
            <Tab.Screen name="Teams" component={TeamsScreen} />
            <Tab.Screen name="Difficulty" component={DifficultyScreen} />
            <Tab.Screen name="Genre" component={GenreScreen} />
            <Tab.Screen name="Game" component={GameScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </TeamProvider>
    </ThemeProvider>
  );
}
