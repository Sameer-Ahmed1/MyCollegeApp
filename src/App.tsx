import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {PaperProvider} from 'react-native-paper';
import Home from './screens/Home';
import Profile from './screens/Profile';
import {RootStackParamList} from './types';
import Teacher from './screens/Teacher';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Teacher'}>
          <Stack.Screen name={'Home'} component={Home} />
          <Stack.Screen name={'Profile'} component={Profile} />
          <Stack.Screen name={'Teacher'} component={Teacher} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
