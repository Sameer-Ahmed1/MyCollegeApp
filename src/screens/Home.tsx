import React, {useState} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import {HomeNavigationProps} from '../types';

export default function Home({navigation}: HomeNavigationProps) {
  const [count, setCount] = useState(0);
  const incrementCount = () => setCount(count + 1);
  return (
    <View className="m-4 border rounded">
      <Button onPress={incrementCount} mode="contained">
        {count} clicks
      </Button>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile page
      </Button>
    </View>
  );
}
