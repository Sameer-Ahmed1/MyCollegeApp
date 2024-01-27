import {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Animated} from 'react-native';
import {
  Card,
  IconButton,
  MD3Colors,
  ProgressBar,
  Text,
  TextInput,
} from 'react-native-paper';
import {attendance} from '../data/attendance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AttendanceData} from '../types';

export default function Attendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendanceArray, setAttendanceArray] = useState<AttendanceData[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [daysCanBeAbsent, setDaysCanBeAbsent] = useState(0);
  const [attended, setAttended] = useState(true);

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const storageKey = 'attendanceArrayKey';
  let startDate = new Date(2024, 0, 1);
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
      console.log('maxDaysCanBeAbsent', maxDaysCanBeAbsent);
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
  const value = useState(new Animated.Value(0))[0];
  const handleToggle = async (didAttend: boolean) => {
    if (didAttend) {
      moveLeft();
    } else {
      moveRight();
    }
    markAttendance(didAttend);
  };
  const moveLeft = (duration = 500) => {
    Animated.timing(value, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
  };
  const moveRight = (duration = 500) => {
    Animated.timing(value, {
      toValue: 175,
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
        style={[
          {
            marginHorizontal: 20,
            marginVertical: 10,
            width: 350,
            height: 104,
          },
        ]}
        className="flex border-2 rounded-lg bg-white-300  shadow-lg">
        <Pressable
          onPress={() => handleToggle(true)}
          style={{position: 'absolute', zIndex: 5, height: 100, width: 175}}>
          <View>
            <Text className="text-5xl ml-3 mt-6">Yes</Text>
          </View>
        </Pressable>
        {attendanceMarked && (
          <Animated.View
            style={[
              {
                width: 175,
                height: 100,

                marginLeft: value,
              },
            ]}
            className="rounded-lg bg-purple-400"></Animated.View>
        )}
        <Pressable
          onPress={() => handleToggle(false)}
          style={{
            position: 'absolute',
            zIndex: 5,
            marginLeft: 175,
            height: 100,
            width: 175,
          }}>
          <View>
            <Text className="text-5xl ml-3 mt-6">No</Text>
          </View>
        </Pressable>
      </View>
      {!attendanceMarked && (
        <Text className="pl-3 pt-4 text-2xl text-center">
          You have not marked your attendance'
        </Text>
      )}
      <Card className="mt-4 mx-4">
        <Card.Title title={`Attendance stats`} />
        <Card.Content>
          <Text variant="titleLarge">{`Attendance: ${attendancePercentage.toFixed(
            2,
          )}%`}</Text>
          {/* <ProgressBar
            className=" mr-2"
            progress={attendancePercentage * 0.01}
            color={MD3Colors.primary20}
            style={{height: 7}}
          /> */}
          <Text variant="bodyMedium">{`Total working days: ${totalWorkingDays}`}</Text>
        </Card.Content>
      </Card>
      <Card className="mt-4 mx-4">
        <Card.Content>
          <Text variant="titleLarge">
            {daysCanBeAbsent <= 0
              ? 'You cannot be absent anymore without falling below 75% attendance'
              : `You can be absent for ${daysCanBeAbsent} more day(s) without falling below 75% attendance`}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
