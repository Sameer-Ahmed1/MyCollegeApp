import {useEffect, useState} from 'react';
import {View, Pressable, Animated, ScrollView} from 'react-native';
import {Button, Card, Modal, Text, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AttendanceData} from '../types';
import * as Progress from 'react-native-progress';

export default function Attendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    numberOfDaysPresent: 0,
    numberOfDaysAbsent: 0,
  });
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [daysCanBeAbsent, setDaysCanBeAbsent] = useState<number>(0);
  const [attended, setAttended] = useState<boolean>(false);
  const [absentAdded, setAbsentAdded] = useState<boolean>(false);
  const [absentDays, setAbsentDays] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);

  const today = new Date();
  const todayDate = new Date().toISOString().split('T')[0];
  const storageKey1 = 'attendanceArrayKey';
  const storageKey2 = `attended${todayDate}`;
  const storageKey3 = `absentAdded`;
  const academicStartDate = new Date(2024, 0, 1);
  const academicDuration = 300;
  const totalWorkingDays = calculateWorkingDays(academicStartDate);

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
      const attendanceDataContent = await AsyncStorage.getItem(storageKey1);
      if (attendanceDataContent !== null) {
        const attendanceDataValue = JSON.parse(attendanceDataContent);
        setAttendanceData(attendanceDataValue);
        const attendedToday = await AsyncStorage.getItem(storageKey2);
        if (attendedToday !== null) {
          setAttended(JSON.parse(attendedToday));
          setAttendanceMarked(true);
          if (JSON.parse(attendedToday)) {
            moveLeft(0);
          } else {
            moveRight(0);
          }
        }
      }
      const absentStorageContent = await AsyncStorage.getItem(storageKey3);
      if (absentStorageContent !== null) {
        setAbsentAdded(JSON.parse(absentStorageContent));
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function markAttendance(isAttended: boolean) {
    try {
      let attendanceDataCopy: AttendanceData = JSON.parse(
        JSON.stringify(attendanceData),
      );
      if (!attendanceMarked) {
        if (isAttended) {
          attendanceDataCopy.numberOfDaysPresent++;
        } else {
          attendanceDataCopy.numberOfDaysAbsent++;
        }
      } else {
        if (attended !== isAttended) {
          if (attended && !isAttended) {
            attendanceDataCopy.numberOfDaysPresent--;
            attendanceDataCopy.numberOfDaysAbsent++;
          } else if (!attended && isAttended) {
            attendanceDataCopy.numberOfDaysPresent++;
            attendanceDataCopy.numberOfDaysAbsent--;
          }
        }
      }
      await AsyncStorage.setItem(
        storageKey1,
        JSON.stringify(attendanceDataCopy),
      );
      await AsyncStorage.setItem(storageKey2, JSON.stringify(isAttended));
      setAttendanceData(attendanceDataCopy);
      setAttendanceMarked(true);
      setAttended(isAttended);
    } catch (e) {
      console.log(e);
    }
  }
  async function addAbsentDays() {
    let attendanceDataCopy: AttendanceData = JSON.parse(
      JSON.stringify(attendanceData),
    );
    const totalMarked =
      attendanceDataCopy.numberOfDaysPresent +
      attendanceDataCopy.numberOfDaysAbsent;
    if (absentDays <= totalWorkingDays - totalMarked) {
      const attendedDays = totalWorkingDays - totalMarked - absentDays;
      attendanceDataCopy.numberOfDaysPresent += attendedDays;
      attendanceDataCopy.numberOfDaysAbsent += absentDays;
      try {
        await AsyncStorage.setItem(
          storageKey1,
          JSON.stringify(attendanceDataCopy),
        );
        setAttendanceData(attendanceDataCopy);
        await AsyncStorage.setItem(storageKey3, JSON.stringify(true));
        setAbsentAdded(true);
      } catch (e) {
        console.log(e);
      }
    }
  }

  function calculatePercentage() {
    if (totalWorkingDays > 0) {
      let attendedDays = attendanceData.numberOfDaysPresent;
      const absentDays = attendanceData.numberOfDaysAbsent;
      const totalMarked = attendedDays + absentDays;
      attendedDays += totalWorkingDays - totalMarked; //if there are any days that are not marked then consider them present
      const attendancePercentageValue = (attendedDays / totalWorkingDays) * 100;
      const remainingDays = academicDuration - totalWorkingDays;
      const maxDaysCanBeAbsent = Math.floor(academicDuration * 0.25);
      const daysCanBeAbsentValue =
        remainingDays <= maxDaysCanBeAbsent - absentDays
          ? remainingDays
          : maxDaysCanBeAbsent - absentDays;
      setAttendancePercentage(attendancePercentageValue);
      setDaysCanBeAbsent(daysCanBeAbsentValue);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);
  useEffect(() => {
    if (attended) {
      moveLeft();
    } else {
      moveRight();
    }
  }, [attended]);
  useEffect(() => {
    calculatePercentage();
  }, [attendanceData]);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  async function clearStorage() {
    const keys = [storageKey1, storageKey2, storageKey3];
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.log(e);
    }

    console.log('Done');
  }

  /*.....................Animation...............................*/
  const animatedParentViewWidth = 350;
  const value = useState(new Animated.Value(0))[0];
  const handleToggle = async (didAttend: boolean) => {
    // clearStorage(); //for testing only, do not uncomment
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
  console.log('totalWorkingDays', totalWorkingDays);

  console.log(
    'attendanceData.numberOfDaysAbsent',
    attendanceData.numberOfDaysAbsent,
  );
  console.log(
    'attendanceData.numberOfDaysPresent',
    attendanceData.numberOfDaysPresent,
  );
  return (
    <ScrollView>
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
        <Card.Title className="pl-10" title={`Attendance percentage`} />
        <Card.Content>
          <Progress.Circle
            size={200}
            showsText={true}
            progress={attendancePercentage / 100}
            indeterminateAnimationDuration={1000}
          />
          <Text className="text-left mx-4 mt-4" variant="bodyLarge">
            {`Total working days: ${totalWorkingDays}`}
          </Text>
          <Text className="text-left mx-4 " variant="bodyLarge">
            {`Total days present : ${attendanceData.numberOfDaysPresent}`}
          </Text>
          <Text className="text-left mx-4" variant="bodyLarge">
            {`Total days absent: ${attendanceData.numberOfDaysAbsent}`}
          </Text>
        </Card.Content>
        <Card.Content className="flex justify-start ">
          {totalWorkingDays >
            attendanceData.numberOfDaysAbsent +
              attendanceData.numberOfDaysPresent &&
            !absentAdded && (
              <Button icon="cog" onPress={showModal}>
                Settings
              </Button>
            )}
        </Card.Content>
      </Card>

      <Card className="mt-4 mx-4">
        <Card.Content>
          {daysCanBeAbsent <= 0 ? (
            <Text variant="titleLarge">
              You cannot be absent anymore without falling below 75% attendance
            </Text>
          ) : (
            <View>
              <Text variant="titleLarge">You can be absent for</Text>
              <Text variant="displayLarge">{`${daysCanBeAbsent} Days`}</Text>
              <Text variant="bodyMedium">
                more without falling below 75% attendance
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
      <Modal
        visible={modalVisible}
        onDismiss={hideModal}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          marginHorizontal: 40,
        }}>
        <Text className="mx-4 mb-4" variant="bodyLarge">
          How many days you were absent before you started marking attendance in
          this app? Note that this value cannot be changed later. Enter the
          correct value or else it wont be recorded.
        </Text>
        <TextInput
          className="mb-4"
          label="Absent days"
          keyboardType="numeric"
          value={absentDays.toString()}
          onChangeText={text =>
            text.length ? setAbsentDays(parseInt(text)) : setAbsentDays(0)
          }
        />
        <Button
          mode="contained"
          className="w-1/2"
          onPress={() => {
            addAbsentDays();
            hideModal();
          }}>
          Submit
        </Button>
      </Modal>
    </ScrollView>
  );
}
