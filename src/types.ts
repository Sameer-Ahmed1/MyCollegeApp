import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Teacher: undefined;
  Attendance: undefined;
};

export type HomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export interface Teacher {
  id: string;
  name: string;
  department: string;
  profilePicUrl: string;
  phoneNumber: string;
}
export interface Attendance {
  numberOfWorkingDays: number;
  numberOfDaysPresent: number;
  numberOfDaysAbsent: number;
}
