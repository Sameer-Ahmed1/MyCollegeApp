import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

export type HomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
