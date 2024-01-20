import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {PaperProvider} from 'react-native-paper';
import Home from './screens/Home';
import Profile from './screens/Profile';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name={'Home'} component={Home} />
          <Stack.Screen name={'Profile'} component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
