import React, { useState, useEffect } from "react";
import { Text } from "@rneui/base";
import { View, StyleSheet } from "react-native";
import { Divider, List, ListItem } from "@ui-kitten/components";
import { retrieveAllChats } from "../api/ChatAPI";
import LinearGradient from "react-native-linear-gradient";
import { Avatar } from "react-native-ui-lib";

export default function ConversationsPage() {

  const [chats, setChats] = useState(0);
  const [usersInfo, setUsersInfo] = useState([]);

  useEffect(() => {
    const loadChats = async () => {
      const data = await retrieveAllChats();
      setChats(data);
    };
    loadChats();
  }, []);

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

  function renderItem(item, index) {

    return (
      <ListItem
        style={{ height: 80 }}
        title={() => <Text style={styles.title}>{item.item.first_name}</Text>}
        description={() => <Text style={styles.description}>{item.item.chatID}</Text>}
        accessoryLeft={null}
        accessoryRight={null}
      />
    );
  }

  return (
    <View style={{ backgroundColor: "white" }}>
      {chats !== 0 ? (
        <List
          style={styles.container}
          data={chats}
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
  }
);
