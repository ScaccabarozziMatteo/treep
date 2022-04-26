import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "native-base";
import { Avatar } from "react-native-ui-lib";
import { searchUsers } from "../api/UserApi";
import { Button, List, ListItem } from "@ui-kitten/components";
import { SearchBar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import UserProfile from "./UserProfile";
import { serialize } from "react-serialize";


export default function SearchUsers({ navigation, route }) {

  const [users, setUsers] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState();


  function renderButton(user) {
    return(
    <Button size="tiny" onPress={() => navigation.navigate('UserProfile', { user })}>SHOW PROFILE</Button>)
  }

  const renderAvatar = (user) => (
    <Avatar animate label={user.data().first_name.charAt(0) + user.data().last_name.charAt(0)}
            source={user.data().photoURL !== undefined ? { uri: user.data().photoURL } : null} />
  );


  const renderItem = ({ item }) => (
    <ListItem
      title={`${item.data().first_name} ${item.data().last_name}`}
      description={"@" + `${item.data().username}`}
      accessoryLeft={renderAvatar(item)}
      accessoryRight={() => renderButton(item._data)}
    />
  );

  return (
    <View>
      <SearchBar lightTheme placeholder={"Username"} showLoading={showLoading}
                 onChangeText={async (text) => {
                   setShowLoading(true);
                   setSearchedUsers(text);
                   setUsers(await searchUsers(text));
                   await setShowLoading(false);
                 }} value={searchedUsers} />

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

