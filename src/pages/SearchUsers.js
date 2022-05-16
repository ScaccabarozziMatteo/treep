import React, { useEffect, useState } from "react";
import { Keyboard, ScrollView, StatusBar, StyleSheet } from "react-native";
import { View } from "native-base";
import { Avatar, Button } from "react-native-ui-lib";
import { getUserData, searchUsers } from "../api/UserApi";
import { Divider, List, ListItem } from "@ui-kitten/components";
import { SearchBar } from "react-native-elements";
import UserProfile from "./UserProfile";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "@rneui/base";


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
        <Button style={styles.button} size={'medium'} label={'Show Profile'} onPress={() => navigation.navigate("UserProfile", {userID})}/>
      );
    else
      return (
        <Button style={styles.button} size={'medium'} label={'Show My Profile'} onPress={() => navigation.navigate("Profile")} />
      );
  }

  const renderAvatar = (user) => (
    <View>
      <LinearGradient style={{top: -20, width: 64, marginRight: 20, borderRadius: 15 }} colors={["#376AED", "#49B0E2", "#9CECFB"]}>
        <View style={{ margin: 1.8, backgroundColor: "white", borderRadius: 13 }}>
          <Avatar animate imageStyle={{ borderRadius: 10, width: "84%", height: "84%", left: "8%", top: "8%" }}
                  label={user.data().first_name.charAt(0) + user.data().last_name.charAt(0)}
                  backgroundColor={'transparent'}
                  source={user.data().photoURL !== undefined ? { uri: user.data().photoURL } : null} size={60} />
        </View>
      </LinearGradient>
    </View>);


  const renderItem = ({ item }) => (
    <ListItem
      style={{height: 80}}
      title={() => <Text style={styles.title}>{item.data().first_name} {item.data().last_name}</Text>}
      description={() => <Text style={styles.description}>@{item.data().username}</Text>}
      accessoryLeft={renderAvatar(item)}
      ItemSeparatorComponent={Divider}
      accessoryRight={() => renderButton(item._data, item._ref._documentPath._parts[1])}
    />
  );

  return (
    <View>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
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
    maxHeight: 80,
    backgroundColor: "white",
  },
  title: {
    marginLeft: 40,
    color: "#0D253C",
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 17,
    lineHeight: 20,
  },
  description: {
    fontFamily: 'Barlow',
    marginLeft: 40,
    color: "#2D4379",
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.24,
  },
  button: {
    backgroundColor: '#386BED',
    borderColor: "transparent",
    borderRadius: 12,
  }

});

