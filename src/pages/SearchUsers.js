import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "native-base";
import { Avatar } from "react-native-ui-lib";
import { searchUsers } from "../api/FirebaseApi";
import { Button, List, ListItem } from '@ui-kitten/components';
import { SearchBar } from "react-native-elements";


export default function SearchUsers() {

  const [users, setUsers] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState()

  const data = new Array(8).fill({
    title: 'Title for Item',
    description: 'Description for Item',
  });

  const renderButton = () => (
    <Button size='tiny'>SHOW PROFILE</Button>
  );

  const renderAvatar = (user) => (
    <Avatar animate label={user.data().first_name.charAt(0) + user.data().last_name.charAt(0)} source={user.data().photoURL !== null ? { uri: user.data().photoURL } : null} />
  )



  const renderItem = ({ item }) => (
    <ListItem
      title={`${item.data().first_name} ${item.data().last_name}`}
      description={'@' + `${item.data().username}`}
      accessoryLeft={renderAvatar(item)}
      accessoryRight={renderButton}
    />
  );

  return (
    <View>
      <SearchBar lightTheme placeholder={"Username"} showLoading={showLoading}
                 onChangeText={async (text) => {
                   setShowLoading(true)
                   setSearchedUsers(text);
                   setUsers(await searchUsers(text))
                   await setShowLoading(false)
                 }} value={searchedUsers}/>

      {() => console.log(users)}
      {() => console.log(data)}

      {users ? (
      <List
        style={styles.container}
        data={users}
        renderItem={renderItem}
      />) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 192,
  },
});

