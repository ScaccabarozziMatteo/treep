import React, { useState, useEffect } from "react";
import { Text } from "@rneui/base";
import { View, StyleSheet, FlatList } from "react-native";
import { ListItem } from "@ui-kitten/components";
import { retrieveAllChats } from "../api/ChatAPI";
import LinearGradient from "react-native-linear-gradient";
import { Avatar } from "react-native-ui-lib";
import { Button } from "react-native-paper";

export default function ConversationsPage({ navigation }) {

  const [chats, setChats] = useState(0);

  useEffect(() => {
    const loadChats = async () => {
      const data = await retrieveAllChats();
      setChats(data);
    };
    loadChats();
    return () => {
      // Useful for cleanup functions
    };
  }, []);

  const timestampRight = (item) => (
    <View >
      <Text style={styles.timestampText}>
        {new Date(item.item.lastMessage[0].timestamp).toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        })} {" "}
        {new Date(item.item.lastMessage[0].timestamp).toLocaleDateString()}
      </Text>
    </View>
  );

  function pressButton() {
    navigation.navigate({ name: "SearchUsers", params: { title: "New chat", typeSearch: "newChat" } });
  }

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
      <Text style={{ color: "black" }}>No chat available</Text>
    );
  }

  function renderItem(item) {
    return (
      <ListItem
        style={{ height: 80 }}
        onPress={() => navigation.navigate({ name: 'ChatPage', params: {titlePage: 'Chat with ' + item.item.last_name, friendID: item.item.userID} })}
        title={() => <Text style={styles.title}>{item.item.first_name} {item.item.last_name}</Text>}
        description={() => <Text numberOfLines={2} style={styles.description}>{item.item.lastMessage[0].body}</Text>}
        accessoryLeft={renderAvatar(item)}
        accessoryRight={timestampRight(item)}
      />
    );
  }

  return (
    <View style={{ backgroundColor: "white", height: '100%'}}>
      {chats !== 0 ? (
        <FlatList
          data={chats}
          renderItem={renderItem}
        />) : noChats()}
      <Button style={styles.button} uppercase={false} labelStyle={styles.labelButton} icon={"plus"}
              onPress={pressButton}>New message</Button>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
    },
    title: {
      marginLeft: 40,
      color: "#505664",
      fontFamily: "Barlow",
      fontWeight: "700",
      fontSize: 17,
      lineHeight: 20,
    },
    description: {
      fontFamily: "Barlow",
      marginLeft: 40,
      color: "#505664",
      fontWeight: "400",
      marginBottom: 5,
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: -0.24,
    },
  timestampText: {
    color: "#AEB3C2",
    width: 150,
    left: -100,
    top: -20
  },
    button: {
      position: "absolute",
      backgroundColor: "#E05D5B",
      borderRadius: 20,
      elevation: 8,
      borderColor: "rgba(0, 0, 0, 0)",
      marginTop: 20,
      width: 210,
      alignSelf: "flex-end",
      padding: 5,
      alignItems: "center",
      right: 20,
      bottom: 20,
    },
    labelButton: {
      fontFamily: "Barlow",
      fontWeight: "400",
      color: "white",
      fontSize: 18,
      lineHeight: 24,
    },
  },
);
