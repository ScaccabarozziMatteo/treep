import React, { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import { View } from "native-base";
import { Avatar } from "react-native-ui-lib";
import { getUserData, searchUsers } from "../api/UserApi";
import { Button, List, ListItem } from "@ui-kitten/components";
import { SearchBar } from "react-native-elements";
import UserProfile from "./UserProfile";

export default function SearchUsers({ navigation, route }) {

  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState();

  useEffect(() => {
    const updateValue = async () => {
      const user = await getUserData();
      setLoggedUser(user);
    };
    updateValue();
  }, []);

  // If user search his/her profile, app show the own profile page
  function renderButton(user, userID) {
    if (loggedUser.username !== user.username)
      return (
        <Button size="tiny" onPress={() => navigation.navigate("UserProfile", { user, userID })}>SHOW PROFILE</Button>
      );
    else
      return (
        <Button size="tiny" onPress={() => navigation.navigate("Profile")}>SHOW MY PROFILE</Button>
      );
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
      accessoryRight={() => renderButton(item._data, item._ref._documentPath._parts[1])}
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

