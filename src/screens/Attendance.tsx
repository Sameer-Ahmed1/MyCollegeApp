import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  BottomNavigation,
  Button,
  Card,
  MD3Colors,
  ProgressBar,
  Text,
} from 'react-native-paper';
import {attendance} from '../data/attendance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  btn: {
    marginVertical: 20,
  },
});
export default function Attendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attended, setAttended] = useState(false);
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
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleAttendance = async (didAttend: boolean) => {
    await AsyncStorage.setItem(storagekey1, JSON.stringify(true));
    await AsyncStorage.setItem(storagekey2, JSON.stringify(didAttend));
    setAttendanceMarked(true);
    setAttended(didAttend);
  };
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
      <Text className="text-black text-2xl text-center">
        Did you go to college today?
      </Text>
      <View className="flex flex-row justify-center gap-x-5 pt-10 px-4">
        <Button
          disabled={attendanceMarked}
          contentStyle={styles.btn}
          className=" flex-1 text-2xl"
          mode="contained"
          onPress={() => handleAttendance(true)}>
          <Text className="text-2xl">Yes</Text>
        </Button>
        <Button
          disabled={attendanceMarked}
          contentStyle={styles.btn}
          className=" flex-1 text-2xl"
          mode="elevated"
          onPress={() => handleAttendance(false)}>
          <Text className="text-2xl">No</Text>
        </Button>
      </View>
      <Text className="pl-3 pt-4 text-2xl text-center">
        {attendanceMarked
          ? attended
            ? 'You have attended the class'
            : 'You have not attended the class'
          : 'You have not marked your attendance'}
      </Text>
      <Card className="mt-4">
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
      <Card className="mt-4">
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
