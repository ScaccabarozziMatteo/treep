import React, { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet } from "react-native";
import { View } from "native-base";
import { Avatar, Button } from "react-native-ui-lib";
import { currentUser, getUserData, searchUsers } from "../api/UserApi";
import { Divider, ListItem } from "@ui-kitten/components";
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
    return () => updateValue();
  }, []);

  // If user search his/her profile, app show the own profile page
  function renderButton(user) {

    if (currentUser().uid !== user.userID && route.params.typeSearch === "searchUsers")
      return (
        <Button style={styles.button} size={"medium"} label={"Show Profile"}
                onPress={() => navigation.navigate("UserProfile", { userID: user.userID })} />
      );
    else if (currentUser().uid !== user.userID && route.params.typeSearch === "newChat") {
      return (
        <Button style={styles.buttonChat} size={"medium"} label={"Start chat"}
                onPress={() => navigation.navigate({
                  name: "ChatPage",
                  params: { titlePage: "Chat with " + user.first_name, friendID: user.userID },
                })} />
      );
    } else if (loggedUser.username === user.username)
      return (
        <Button style={styles.button} size={"medium"} label={"Show My Profile"}
                onPress={() => navigation.navigate("Profile")} />
      );
    else
      return (null);
  }

  const renderAvatar = (user) => (
    <View>
      <LinearGradient style={{ top: -20, width: 64, marginRight: 20, borderRadius: 15 }}
                      colors={["#376AED", "#49B0E2", "#9CECFB"]}>
        <View style={{ margin: 1.8, backgroundColor: "white", borderRadius: 13 }}>
          <Avatar animate imageStyle={{ borderRadius: 10, width: "84%", height: "84%", left: "8%", top: "8%" }}
                  label={user.first_name.charAt(0) + user.last_name.charAt(0)}
                  backgroundColor={"transparent"}
                  source={user.photoURL !== undefined ? { uri: user.photoURL } : null} size={60} />
        </View>
      </LinearGradient>
    </View>);


  function renderItem({ item }) {
    return (
      <ListItem
        style={{ height: 80 }}
        title={() => <Text style={styles.title}>{item.first_name} {item.last_name}</Text>}
        description={() => <Text style={styles.description}>@{item.username}</Text>}
        accessoryLeft={renderAvatar(item)}
        ItemSeparatorComponent={Divider}
        accessoryRight={() => renderButton(item)}
      />
    );
  }

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <SearchBar lightTheme placeholder={"Search a user..."} showLoading={showLoading}
                 onChangeText={async (text) => {
                   setShowLoading(true);
                   setSearchedUsers(text);
                   setUsers(await searchUsers(text));
                   await setShowLoading(false);
                 }} value={searchedUsers} />

      {users ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.userID}
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
    fontFamily: "Barlow",
    marginLeft: 40,
    color: "#2D4379",
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.24,
  },
  button: {
    backgroundColor: "#386BED",
    borderColor: "transparent",
    borderRadius: 12,
  },
  buttonChat: {
    backgroundColor: "#E05D5B",
    borderColor: "transparent",
    borderRadius: 12,
  },

});

