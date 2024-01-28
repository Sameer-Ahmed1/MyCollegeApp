import {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Animated} from 'react-native';
import {Card, IconButton, MD3Colors, Text, TextInput} from 'react-native-paper';
import {attendance} from '../data/attendance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AttendanceData} from '../types';
import * as Progress from 'react-native-progress';

export default function Attendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendanceArray, setAttendanceArray] = useState<AttendanceData[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [daysCanBeAbsent, setDaysCanBeAbsent] = useState<number>(0);
  const [attended, setAttended] = useState<boolean>(true);

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const storageKey = 'attendanceArrayKey';
  const startDate = new Date(2024, 0, 1);
  const totalWorkingDays = calculateWorkingDays(startDate);

  function calculateWorkingDays(startDate: Date) {
    let endDate = new Date();
    let totalWorkingDaysValue = 0;

    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      let dayOfWeek = day.getDay();
      if (dayOfWeek != 0 && dayOfWeek != 6) {
        // 0: Sunday, 6: Saturday
        totalWorkingDaysValue++;
      }
    }
    return totalWorkingDaysValue;
  }

  async function loadAttendance() {
    try {
      const storageContent = await AsyncStorage.getItem(storageKey);
      if (storageContent !== null) {
        const attendanceArrayValue = JSON.parse(storageContent);

        calculatePercentage(attendanceArrayValue);
        setAttendanceArray(attendanceArrayValue);
        const todayAttendance = attendanceArrayValue.find(
          (item: AttendanceData) => item.date === formattedDate,
        );
        if (todayAttendance) {
          setAttendanceMarked(true);
          setAttended(todayAttendance.attended);
          if (todayAttendance.attended) {
            moveLeft(0);
          } else {
            moveRight(0);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  function calculatePercentage(array: AttendanceData[]) {
    if (totalWorkingDays > 0) {
      const attendedDays = array.filter(item => item.attended).length;
      const percentage = (attendedDays / totalWorkingDays) * 100;
      const remainingDays = attendance.numberOfWorkingDays - totalWorkingDays;
      const daysAbsent = totalWorkingDays - attendedDays;
      const maxDaysCanBeAbsent = Math.floor(
        attendance.numberOfWorkingDays * 0.25,
      );
      const daysCanBeAbsentValue =
        remainingDays <= maxDaysCanBeAbsent - daysAbsent
          ? remainingDays
          : maxDaysCanBeAbsent - daysAbsent;
      setAttendancePercentage(percentage);
      setDaysCanBeAbsent(daysCanBeAbsentValue);
    }
  }
  async function markAttendance(isAttended: boolean) {
    try {
      let newArray: AttendanceData[] = [...attendanceArray];
      const todayIndex = newArray.findIndex(
        item => item.date === formattedDate,
      );
      if (todayIndex >= 0) {
        newArray[todayIndex] = {date: formattedDate, attended: isAttended};
      } else {
        newArray = [...newArray, {date: formattedDate, attended: isAttended}];
      }
      await AsyncStorage.setItem(storageKey, JSON.stringify(newArray));
      setAttendanceArray(newArray);
      calculatePercentage(newArray);
      setAttendanceMarked(true);
      setAttended(isAttended);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  /*.....................Animation...............................*/
  const animatedParentViewWidth = 350;
  const value = useState(new Animated.Value(0))[0];
  const handleToggle = async (didAttend: boolean) => {
    if (didAttend) {
      moveLeft();
    } else {
      moveRight();
    }
    markAttendance(didAttend);
  };
  const moveLeft = (duration = 400) => {
    Animated.timing(value, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
  };
  const moveRight = (duration = 400) => {
    Animated.timing(value, {
      toValue: animatedParentViewWidth / 2,
      duration: duration,
      useNativeDriver: false,
    }).start();
  };
  return (
    <View>
      <Text className="text-black text-2xl text-center pt-4 pb-4  mt-4 mb-4 bg-gray-200">
        Did you go to college today?
      </Text>
      <View
        className="flex rounded-lg bg-gray-300  shadow-lg"
        style={[
          {
            marginHorizontal: 20,
            marginVertical: 10,
            width: animatedParentViewWidth,
            height: 104,
          },
        ]}>
        <Pressable
          onPress={() => handleToggle(true)}
          style={{
            position: 'absolute',
            zIndex: 5,
            height: 100,
            width: animatedParentViewWidth / 2,
          }}>
          <View>
            <Text className="text-5xl text-center mt-6">Yes</Text>
          </View>
        </Pressable>
        {attendanceMarked && (
          <Animated.View
            style={[
              {
                width: animatedParentViewWidth / 2,
                height: 100,
                marginLeft: value,
              },
            ]}
            className={
              'rounded-lg ' + (attended ? 'bg-green-400' : 'bg-red-400')
            }></Animated.View>
        )}
        <Pressable
          onPress={() => handleToggle(false)}
          style={{
            position: 'absolute',
            zIndex: 5,
            marginLeft: animatedParentViewWidth / 2,
            height: 100,
            width: animatedParentViewWidth / 2,
          }}>
          <View>
            <Text className="text-5xl text-center mt-6">No</Text>
          </View>
        </Pressable>
      </View>
      {!attendanceMarked && (
        <Text className="pl-3 pt-4 text-2xl text-center">
          You have not marked your attendance'
        </Text>
      )}
      <Card className="flex flex-col justify-center  items-center mt-4 mx-4">
        <Card.Title title={`Attendance percentage`} />
        <Card.Content>
          <Progress.Circle
            size={200}
            showsText={true}
            progress={attendancePercentage / 100}
          />
          <Text className="mx-6 my-4" variant="bodyLarge">
            {`Total working days: ${totalWorkingDays}`}
          </Text>
        </Card.Content>
      </Card>

      <Card className="mt-4 mx-4">
        <Card.Content>
          <Text variant="titleLarge">
            {daysCanBeAbsent <= 0
              ? 'You cannot be absent anymore without falling below 75% attendance'
              : `You can be absent for ${daysCanBeAbsent} more days without falling below 75% attendance`}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
