import * as React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { HStack, VStack } from "native-base";
import { ScrollView, TextField } from "native-base";
import { TextInput } from "react-native-paper";
import { useEffect } from "react";
import { retrieveSpecificChat, sendMessageDB, setChatsFirestore } from "../api/ChatAPI";
import { firebase } from "@react-native-firebase/database";
import { currentUser } from "../api/UserApi";
import { Divider, List, ListItem } from "@ui-kitten/components";


export default function ChatPage({ route }) {

  const [text, setText] = React.useState("");
  const [chatID, setChatID] = React.useState("0");
  const [friendID, setFriendID] = React.useState(route.params.friendID);
  const [chat, setChat] = React.useState("");

  const DB = firebase.app().database("https://treep-mdp-default-rtdb.europe-west1.firebasedatabase.app/");

  useEffect(() => {
    const updateChatInfo = async () => {
      const ID = await retrieveSpecificChat(friendID);
      setChatID(ID);
    };
    updateChatInfo();
  }, []);

  useEffect(() => {
    if (chatID === 0)
      newChat();
    else
      existingChat();
  }, [chatID]);

  function existingChat() {

    const onValueChange = DB
      .ref(`/chats/${chatID}`)
      .on("value", snapshot => {
        if (snapshot.exists()) {
          let arr = Object.values(snapshot.val())
          arr.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          setChat(arr)
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/chats/${chatID}`).off("value", onValueChange);
  }

  function sendMessage(messageBody) {
    setText("");
    if (messageBody !== "") {
      if (chatID === 0) {
        const ID = Math.random().toString(36).slice(2);
        setChatID(ID);
        setChatsFirestore(friendID, ID);
        sendMessageDB(ID, messageBody);
      } else
        sendMessageDB(chatID, messageBody);
    }
  }

  const renderItem = ({ item }) => (
    <ListItem
      style={{ height: 80 }}
      title={() => <Text style={styles.title}>{new Date(item.timestamp).toLocaleString()}</Text>}
      description={() => <Text
        style={item.userID === currentUser().uid ? styles.messageCurrentUser : styles.messageFriendUser}>{item.body}</Text>}
      accessoryLeft={null}
      ItemSeparatorComponent={Divider}
    />
  );


  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: "white" }}>
        <VStack height={"100%"} marginBottom={-20} justifyContent={"flex-end"}>
          <HStack>
            <List
              style={styles.container}
              data={chat}
              keyExtractor={(item, index)=>index}
              renderItem={renderItem}
              inverted
            />

          </HStack>
        </VStack>
      </View>
      <TextInput label={"Type a message ..."} activeUnderlineColor={"#0D253C"} multiline style={styles.textInput}
                 value={text} onChangeText={text => setText(text)}
                 right={<TextInput.Icon name="send" color={"#0D253C"} onPress={() => sendMessage(text)} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    backgroundColor: "#CCCCCC",
    fontFamily: "Barlow",
    fontSize: 18,
  },
  messageFriendUser: {
    fontFamily: "Barlow",
    color: "black",
    textAlign: "left",
    alignSelf: "flex-start",
    padding: 12,
    maxWidth: "80%",
    backgroundColor: "#67B9A5",
    borderRadius: 18,
    margin: 5,
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.24,
  },
  messageCurrentUser: {
    fontFamily: "Barlow",
    color: "black",
    textAlign: "right",
    alignSelf: "flex-end",
    padding: 12,
    maxWidth: "80%",
    backgroundColor: "#B4E0E2",
    borderRadius: 18,
    margin: 5,
    marginLeft: 40,
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.24,
  },
  title: {
    alignSelf: "center",
    color: "#2D4379",
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 10,
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
});
