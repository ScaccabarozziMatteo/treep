import React, { useState, useEffect } from "react";
import { Text } from "@rneui/base";
import { View, StyleSheet, FlatList } from "react-native";
import { ListItem } from "@ui-kitten/components";
import LinearGradient from "react-native-linear-gradient";
import { Avatar } from "react-native-ui-lib";
import { currentUser, getFollowComplete, getFollowings } from "../api/UserApi";

export default function ConversationsPage({ navigation, route }) {

  const [follow, setFollow] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      let data;
      switch (route.params.type) {
        case "followers":
          data = await getFollowComplete(route.params.userId, 'followers');
          break;
        case "followings":
          data = await getFollowComplete(route.params.userId, 'followings');
          break;
      }
      setFollow(data);
    };
    loadData();
    return () => {
      // Useful for cleanup functions
      setFollow(0)
    };
  }, [route.params]);

  const renderAvatar = (user) => (
    <View>
      <LinearGradient style={{ top: -20, width: 64, marginRight: 20, borderRadius: 15 }}
                      colors={["#376AED", "#49B0E2", "#9CECFB"]}>
        <View style={{ margin: 1.8, backgroundColor: "white", borderRadius: 13 }}>
          <Avatar animate imageStyle={{ borderRadius: 10, width: "84%", height: "84%", left: "8%", top: "8%" }}
                  label={user.item.first_name.charAt(0) + user.item.last_name.charAt(0)}
                  backgroundColor={"transparent"}
                  source={user.item.photoURL !== undefined ? { uri: user.item.photoURL } : null} size={60} />
        </View>
      </LinearGradient>
    </View>);

  function noChats() {
    return (
      <Text style={{ color: "black" }}>List is empty</Text>
    );
  }

  function renderItem(item) {
    console.log(item.item)
    return (
      <ListItem
        style={{ height: 80 }}
        onPress={() => item.item.userId === currentUser().uid ? navigation.navigate('Profile') : navigation.navigate({name: "UserProfile", params: {userID: item.item.userId}})}
        title={() => <Text style={styles.title}>{item.item.first_name} {item.item.last_name}</Text>}
        description={() => <Text numberOfLines={2} style={styles.description}>@{item.item.username}</Text>}
        accessoryLeft={renderAvatar(item)}
      />
    );
  }

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      {follow !== 0 ? (
        <FlatList
          data={follow}
          renderItem={renderItem}
        />) : noChats()}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
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
    }
  },
);
