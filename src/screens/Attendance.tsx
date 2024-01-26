import {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Animated} from 'react-native';
import {Card, MD3Colors, ProgressBar, Text} from 'react-native-paper';
import {attendance} from '../data/attendance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Attendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(true);
  const [attended, setAttended] = useState(true);
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const storagekey1 = `attendanceMarked${formattedDate}`;
  const storagekey2 = `attended${formattedDate}`;
  async function loadAttendance() {
    const value = await AsyncStorage.getItem(storagekey1);
    console.log('value', value);
    if (value !== null) {
      setAttendanceMarked(JSON.parse(value));
    }
    const value2 = await AsyncStorage.getItem(storagekey2);
    console.log('value2', value2);
    if (value2 !== null) {
      setAttended(JSON.parse(value2));
      if (!JSON.parse(value2)) {
        moveRight(1);
      }
    }
  }
  const value = useState(new Animated.Value(0))[0];
  const handleToggle = async (didAttend: boolean) => {
    if (didAttend) {
      moveLeft();
    } else {
      moveRight();
    }
    await AsyncStorage.setItem(storagekey1, JSON.stringify(true));
    await AsyncStorage.setItem(storagekey2, JSON.stringify(didAttend));
    setAttendanceMarked(true);
    setAttended(didAttend);
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
  useEffect(() => {
    loadAttendance();
  }, []);

  const totalDays =
    attendance.numberOfDaysPresent + attendance.numberOfDaysAbsent;
  const remainingDays = attendance.numberOfWorkingDays - totalDays;

  const attendancePercentage =
    (attendance.numberOfDaysPresent / totalDays) * 100;
  const maxDaysCanBeAbsent = Math.floor(attendance.numberOfWorkingDays * 0.25);
  const daysCanBeAbsent =
    remainingDays <= maxDaysCanBeAbsent ? remainingDays : maxDaysCanBeAbsent;

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
          <ProgressBar
            className=" mr-2"
            progress={attendancePercentage * 0.01}
            color={MD3Colors.primary20}
            style={{height: 7}}
          />
          <Text variant="bodyMedium">{`Number of days present: ${attendance.numberOfDaysPresent}`}</Text>
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
