import Fuse, {IFuseOptions} from 'fuse.js';
import React, {useState} from 'react';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {Avatar, List, Searchbar} from 'react-native-paper';
import {teachers} from '../data/teachers';
import {Teacher as TeacherT} from '../types';

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

const fuseOptions: IFuseOptions<TeacherT> = {
  keys: ['name', 'department'],
  shouldSort: true,
};
const fuse = new Fuse(teachers, fuseOptions);

export default function Teacher() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchResultItems: TeacherT[] = fuse
    .search(searchQuery)
    .map(r => r.item);

  return (
    <View className="mx-4 mt-4 flex-1 space-y-4">
      <Searchbar
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="unless-editing"
      />
      <FlatList
        data={searchResultItems.length === 0 ? teachers : searchResultItems}
        renderItem={ListItem}
      />
    </View>
  );
}
