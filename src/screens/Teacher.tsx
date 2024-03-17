import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Fuse, {IFuseOptions} from 'fuse.js';
import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {Avatar, List, Searchbar} from 'react-native-paper';
import {
  RootStackParamList,
  TeacherNavigationProps,
  Teacher as TeacherT,
} from '../types';
import {fetchTeacher} from '../services/teachers';

interface ListItemProps extends ListRenderItemInfo<TeacherT> {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'Teacher',
    undefined
  >;
}
const teachers = fetchTeacher();
function ListItem(props: ListItemProps) {
  const teacher = props.item;
  return (
    <List.Item
      className="px-4"
      title={teacher.name}
      description={teacher.department}
      // eslint-disable-next-line react/no-unstable-nested-components
      left={_ => (
        <Avatar.Image
          className="bg-white"
          source={{
            uri: 'https://robohash.org/604b9d47-cf1f-4b95-9408-4a86ea1c6cc4',
          }}
        />
      )}
      onPress={() =>
        props.navigation.navigate('TeacherDetail', {
          teacher,
        })
      }
    />
  );
}

export default function Teacher({navigation}: TeacherNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [teachers, setTeachers] = useState<TeacherT[]>([]);
  useEffect(() => {
    fetchTeacher()
      .then(teachers => setTeachers(teachers))
      .catch(() => {
        console.log('Error fetching teachers');
      });
  }, []);
  const fuseOptions: IFuseOptions<TeacherT> = {
    keys: ['name', 'department'],
    shouldSort: true,
  };
  const fuse = new Fuse(teachers, fuseOptions);

  const searchResultItems: TeacherT[] = fuse
    .search(searchQuery)
    .map(r => r.item);

  return (
    <View className="mt-4 flex-1 space-y-4">
      <Searchbar
        className="mx-4"
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="unless-editing"
      />
      <FlatList
        data={searchResultItems.length === 0 ? teachers : searchResultItems}
        renderItem={props => <ListItem {...props} navigation={navigation} />}
      />
    </View>
  );
}
