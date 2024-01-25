import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {PaperProvider} from 'react-native-paper';
import Attendance from './screens/Attendance';
import Home from './screens/Home';
import Notes from './screens/Notes';
import Profile from './screens/Profile';
import Teacher from './screens/Teacher';
import TeacherDetail from './screens/TeacherDetail';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name={'Home'} component={Home} />
          <Stack.Screen name={'Profile'} component={Profile} />
          <Stack.Screen name={'Teacher'} component={Teacher} />
          <Stack.Screen
            name={'TeacherDetail'}
            component={TeacherDetail}
            options={{
              title: 'Teacher Detail',
            }}
          />
          <Stack.Screen name={'Attendance'} component={Attendance} />
          <Stack.Screen name={'Notes'} component={Notes} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
