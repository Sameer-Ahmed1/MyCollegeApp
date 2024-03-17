import React from 'react';
import {Linking, ScrollView, View} from 'react-native';
import {Avatar, Card, Icon, List, Text} from 'react-native-paper';
import {TeacherDetailNavigationProps} from '../types';

function PhoneOutlineIcon() {
  return <Icon size={32} source={'phone-outline'} />;
}

function EmailOutlineIcon() {
  return <Icon size={32} source={'email-outline'} />;
}

function Description({text}: {text: string}) {
  return <Text>{text}</Text>;
}

export default function TeacherDetail({route}: TeacherDetailNavigationProps) {
  const {teacher} = route.params;
  teacher.qualification = 'abc';
  return (
    <ScrollView className="flex-1 space-y-4">
      <View className="flex items-center my-8 space-y-4">
        <Avatar.Image
          size={256}
          source={{
            uri: 'https://robohash.org/604b9d47-cf1f-4b95-9408-4a86ea1c6cc4',
          }}
        />
        <Text variant="headlineLarge">{teacher.name}</Text>
      </View>
      {/* Contact info */}
      <Card className="mx-4">
        <Card.Title title="Contact info" />
        <Card.Content className="px-0">
          {/* Phone number */}
          <List.Item
            className="px-4"
            title={teacher.phoneNumber}
            left={PhoneOutlineIcon}
            onPress={() => Linking.openURL(`tel:${teacher.phoneNumber}`)}
          />
          {/* Email */}
          <List.Item
            className="px-4"
            title={teacher.email}
            left={EmailOutlineIcon}
            onPress={() => Linking.openURL(`mailto:${teacher.email}`)}
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card className="mx-4 mb-4">
        <Card.Title title="About" />
        <Card.Content className="px-0">
          {/* Department */}
          <List.Item
            className="px-4"
            title={teacher.department}
            description={<Description text="Department" />}
          />
          {/* Designation */}
          <List.Item
            className="px-4"
            title={teacher.designation}
            description={<Description text="Designation" />}
          />
          {teacher.qualification && (
            <List.Item
              className="px-4"
              title={teacher.qualification}
              description={<Description text="Qualification" />}
            />
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
