import React, {useState} from 'react';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {Avatar, List, Searchbar} from 'react-native-paper';
import {Teacher as TeacherT} from '../types';

const teachers: TeacherT[] = [
  {
    id: '604b9d47-cf1f-4b95-9408-4a86ea1c6cc4',
    name: 'Miss Norma Carroll',
    department: 'Civil',
    profilePicUrl: 'https://robohash.org/604b9d47-cf1f-4b95-9408-4a86ea1c6cc4',
    phoneNumber: '652-943-0797 x49672',
  },
  {
    id: '2f1208f5-3438-4ea8-bf3f-5f6f9597f119',
    name: 'Connie Lebsack',
    department: 'CSE',
    profilePicUrl: 'https://robohash.org/2f1208f5-3438-4ea8-bf3f-5f6f9597f119',
    phoneNumber: '883.705.7915 x2063',
  },
  {
    id: '5f6b8d39-e5a4-4e5d-8b82-1285bb1e4660',
    name: 'Heather Ondricka',
    department: 'Civil',
    profilePicUrl: 'https://robohash.org/5f6b8d39-e5a4-4e5d-8b82-1285bb1e4660',
    phoneNumber: '820-427-7858 x33895',
  },
  {
    id: 'aaa8cb76-9150-461d-8355-b2868383630b',
    name: 'Freda Hermann',
    department: 'CSE',
    profilePicUrl: 'https://robohash.org/aaa8cb76-9150-461d-8355-b2868383630b',
    phoneNumber: '444-619-3890',
  },
  {
    id: 'be19eb86-ee39-45ad-9108-5545817bcc4f',
    name: 'Denise Krajcik',
    department: 'ET',
    profilePicUrl: 'https://robohash.org/be19eb86-ee39-45ad-9108-5545817bcc4f',
    phoneNumber: '605.832.9575',
  },
  {
    id: '6c7e894d-7f33-466a-8833-515c6a91664e',
    name: 'Dianne Monahan',
    department: 'ET',
    profilePicUrl: 'https://robohash.org/6c7e894d-7f33-466a-8833-515c6a91664e',
    phoneNumber: '699-504-0674 x8120',
  },
  {
    id: '1c93afa3-d8ea-4164-8e81-549c01fd50ea',
    name: 'Dr. Willie Predovic',
    department: 'EIE',
    profilePicUrl: 'https://robohash.org/1c93afa3-d8ea-4164-8e81-549c01fd50ea',
    phoneNumber: '208-548-9461 x43289',
  },
  {
    id: '5881b276-35d7-45e6-a24e-9657a401d653',
    name: 'Grace Runolfsson',
    department: 'MECH',
    profilePicUrl: 'https://robohash.org/5881b276-35d7-45e6-a24e-9657a401d653',
    phoneNumber: '770-439-3792',
  },
  {
    id: 'fcba63b5-4d40-4bde-9130-d902fa352b92',
    name: 'Lena Quitzon',
    department: 'CSE',
    profilePicUrl: 'https://robohash.org/fcba63b5-4d40-4bde-9130-d902fa352b92',
    phoneNumber: '330.611.8299 x7754',
  },
  {
    id: '11718b15-2da2-42b7-aafe-d5a12497c51e',
    name: 'Marjorie Bogan',
    department: 'Civil',
    profilePicUrl: 'https://robohash.org/11718b15-2da2-42b7-aafe-d5a12497c51e',
    phoneNumber: '1-887-655-3836 x95758',
  },
  {
    id: 'dedee09a-8e6f-442d-93c3-a907f02b4fd6',
    name: 'Ann Schuppe',
    department: 'ET',
    profilePicUrl: 'https://robohash.org/dedee09a-8e6f-442d-93c3-a907f02b4fd6',
    phoneNumber: '1-652-991-8206',
  },
  {
    id: '3c089a9c-0c1f-4eb1-9535-acfc89db08fc',
    name: 'Miss Erika Roberts',
    department: 'MECH',
    profilePicUrl: 'https://robohash.org/3c089a9c-0c1f-4eb1-9535-acfc89db08fc',
    phoneNumber: '930.425.6712 x0448',
  },
  {
    id: 'd1798aeb-029b-4e0b-8445-141bbde84634',
    name: 'Mona Miller',
    department: 'MECH',
    profilePicUrl: 'https://robohash.org/d1798aeb-029b-4e0b-8445-141bbde84634',
    phoneNumber: '208-955-1349 x9894',
  },
  {
    id: 'b6e6e8b7-c53f-4d3c-9b05-fbe45ff69d7c',
    name: 'Dora Hyatt',
    department: 'ET',
    profilePicUrl: 'https://robohash.org/b6e6e8b7-c53f-4d3c-9b05-fbe45ff69d7c',
    phoneNumber: '1-364-531-6027 x98781',
  },
  {
    id: '6085a0f1-e8ea-4c05-8edf-163591e6a19a',
    name: 'Opal Schuster',
    department: 'EIE',
    profilePicUrl: 'https://robohash.org/6085a0f1-e8ea-4c05-8edf-163591e6a19a',
    phoneNumber: '(479) 988-3778 x69430',
  },
  {
    id: '59b54fbc-d86d-45b1-8caa-93c85e413104',
    name: 'Patti Hayes',
    department: 'ECE',
    profilePicUrl: 'https://robohash.org/59b54fbc-d86d-45b1-8caa-93c85e413104',
    phoneNumber: '283-815-4893',
  },
  {
    id: '87983478-e841-4b8e-8565-1ed958f5af67',
    name: 'Vera Oberbrunner Sr.',
    department: 'MECH',
    profilePicUrl: 'https://robohash.org/87983478-e841-4b8e-8565-1ed958f5af67',
    phoneNumber: '801.658.5313',
  },
  {
    id: '0bf12edc-e9ad-49da-9e25-e0589bf769d7',
    name: 'Robin Haley',
    department: 'IT',
    profilePicUrl: 'https://robohash.org/0bf12edc-e9ad-49da-9e25-e0589bf769d7',
    phoneNumber: '(527) 412-5760 x614',
  },
  {
    id: '490f1bac-16f9-425b-ab9b-73ed6fa01358',
    name: 'Deborah Orn',
    department: 'ET',
    profilePicUrl: 'https://robohash.org/490f1bac-16f9-425b-ab9b-73ed6fa01358',
    phoneNumber: '1-251-408-0286',
  },
  {
    id: 'c61c8e96-fe1d-4704-951c-4a2bc8e4e1db',
    name: 'Karen Smitham DVM',
    department: 'EIE',
    profilePicUrl: 'https://robohash.org/c61c8e96-fe1d-4704-951c-4a2bc8e4e1db',
    phoneNumber: '389.586.4181 x60184',
  },
  {
    id: '3c864621-c40c-4b52-8307-e0ca653e3b18',
    name: 'Agnes Fadel',
    department: 'Civil',
    profilePicUrl: 'https://robohash.org/3c864621-c40c-4b52-8307-e0ca653e3b18',
    phoneNumber: '1-214-610-4809 x7393',
  },
  {
    id: 'ed5497f9-9f38-4d4c-bea4-ded1282887f4',
    name: 'Beatrice Bahringer',
    department: 'Civil',
    profilePicUrl: 'https://robohash.org/ed5497f9-9f38-4d4c-bea4-ded1282887f4',
    phoneNumber: '(800) 913-7513 x834',
  },
  {
    id: '8958e0e3-cbf0-481c-945b-e6826fe28936',
    name: 'Elena Trantow MD',
    department: 'MECH',
    profilePicUrl: 'https://robohash.org/8958e0e3-cbf0-481c-945b-e6826fe28936',
    phoneNumber: '(758) 521-5735 x466',
  },
  {
    id: 'f3bb8edc-8974-47f3-95eb-92d2129e974a',
    name: 'Lynda West II',
    department: 'ET',
    profilePicUrl: 'https://robohash.org/f3bb8edc-8974-47f3-95eb-92d2129e974a',
    phoneNumber: '941-811-4176 x830',
  },
  {
    id: '3fe66fb2-6000-4494-8739-bef6d66aa389',
    name: 'Janie Kunze',
    department: 'MECH',
    profilePicUrl: 'https://robohash.org/3fe66fb2-6000-4494-8739-bef6d66aa389',
    phoneNumber: '(344) 865-0036 x32456',
  },
  {
    id: 'aee7a3ad-5683-4da3-a102-efb582260921',
    name: 'Ida Wiegand',
    department: 'MECH',
    profilePicUrl: 'https://robohash.org/aee7a3ad-5683-4da3-a102-efb582260921',
    phoneNumber: '493.851.3442 x0500',
  },
  {
    id: '6dad5b7e-dc2c-4266-b642-173d79668edf',
    name: 'Mrs. Erika Carter DVM',
    department: 'Civil',
    profilePicUrl: 'https://robohash.org/6dad5b7e-dc2c-4266-b642-173d79668edf',
    phoneNumber: '1-441-978-6277',
  },
  {
    id: '6e14bac5-e9cc-4f54-b131-b72d859a2488',
    name: 'Vicky Batz',
    department: 'CSE',
    profilePicUrl: 'https://robohash.org/6e14bac5-e9cc-4f54-b131-b72d859a2488',
    phoneNumber: '(410) 522-6021 x343',
  },
  {
    id: 'ce85bd63-087d-4e7b-8c73-63bf07449c5b',
    name: 'Natasha Crooks',
    department: 'ECE',
    profilePicUrl: 'https://robohash.org/ce85bd63-087d-4e7b-8c73-63bf07449c5b',
    phoneNumber: '710-224-4344 x1636',
  },
  {
    id: '3d1b1553-edb3-4bee-98fc-8dd578f20f57',
    name: 'Elaine Goldner',
    department: 'ECE',
    profilePicUrl: 'https://robohash.org/3d1b1553-edb3-4bee-98fc-8dd578f20f57',
    phoneNumber: '1-783-652-5350 x064',
  },
];

function ListItem(props: ListRenderItemInfo<TeacherT>) {
  const teacher = props.item;
  return (
    <List.Item
      title={teacher.name}
      description={teacher.department}
      // eslint-disable-next-line react/no-unstable-nested-components
      left={_ => (
        <Avatar.Image
          className="bg-white"
          source={{uri: teacher.profilePicUrl}}
        />
      )}
    />
  );
}

export default function Teacher() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="mx-4 mt-4 flex-1 space-y-4">
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList data={teachers} renderItem={ListItem} />
    </View>
  );
}