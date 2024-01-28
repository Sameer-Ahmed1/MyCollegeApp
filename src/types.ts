import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Teacher: undefined;
  TeacherDetail: {
    teacher: Teacher;
  };
  Attendance: undefined;
  Notes: undefined;
};

export type HomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export type TeacherNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Teacher'
>;

export type TeacherDetailNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'TeacherDetail'
>;

export interface Teacher {
  /* General */
  id: string;
  profilePicUrl: string;
  name: string;
  /* About */
  department: string;
  designation: string;
  qualification?: string;
  /* Contact */
  phoneNumber: string;
  email: string;
}
export interface Attendance {
  numberOfWorkingDays: number;
  numberOfDaysPresent: number;
  numberOfDaysAbsent: number;
}
export interface AttendanceData {
  numberOfDaysPresent: number;
  numberOfDaysAbsent: number;
}