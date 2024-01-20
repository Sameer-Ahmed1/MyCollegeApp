import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, PaperProvider, Text} from 'react-native-paper';

export default function App() {
  const [count, setCount] = useState(0);
  const incrementCount = () => setCount(count + 1);

  return (
    <PaperProvider>
      <View className="m-4 border rounded">
        <Button onPress={incrementCount} mode="contained">
          Hey
        </Button>
        <Text>{count}</Text>
      </View>
    </PaperProvider>
  );
}
