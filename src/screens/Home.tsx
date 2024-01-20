import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, ButtonProps} from 'react-native-paper';
import {HomeNavigationProps} from '../types';

const styles = StyleSheet.create({
  buttonContent: {
    paddingVertical: 40,
  },
  buttonLabel: {
    paddingTop: 10,
    paddingBottom: 8,
    fontSize: 25,
  },
});

interface HomeScreenButtonProps {
  onPress: ButtonProps['onPress'];
  content: ReactNode;
}

function HomeScreenButton({content, onPress}: HomeScreenButtonProps) {
  return (
    <Button
      mode="contained"
      className="mb-8"
      labelStyle={styles.buttonLabel}
      contentStyle={styles.buttonContent}
      onPress={onPress}>
      {content}
    </Button>
  );
}

export default function Home({navigation}: HomeNavigationProps) {
  const {navigate} = navigation;
  return (
    <View className="m-4 flex-1 flex justify-center">
      <View className="mx-8">
        <HomeScreenButton
          content="Teacher"
          onPress={() => navigate('Teacher')}
        />
        <HomeScreenButton
          content="Attendance"
          onPress={() => navigate('Attendance')}
        />
        <HomeScreenButton content="Notes" onPress={() => navigate('Notes')} />
      </View>
    </View>
  );
}
