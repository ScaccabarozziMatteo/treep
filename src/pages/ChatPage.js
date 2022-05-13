import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HStack, VStack } from "native-base";
import { ScrollView, TextField } from "native-base";
import { TextInput } from "react-native-paper";
import { useEffect } from "react";
import { retrieveSpecificChat, sendMessageDB, setChatsFirestore } from "../api/ChatAPI";
import { firebase } from "@react-native-firebase/database";
import { currentUser } from "../api/UserApi";


export default function ChatPage({ route }) {

  const [text, setText] = React.useState("");
  const [chatID, setChatID] = React.useState("");
  const [friendID, setFriendID] = React.useState(route.params.friendID);

  const DB = firebase.app().database("https://treep-mdp-default-rtdb.europe-west1.firebasedatabase.app/");

  useEffect(() => {
    const updateChatInfo = async () => {
      const ID = await retrieveSpecificChat(friendID);
      setChatID(ID);
      if (chatID === 0)
        newChat();
      else
        existingChat();
    };
    updateChatInfo();
  }, []);

  function existingChat() {

    const onValueChange = DB
      .ref(`/chats/${chatID}`)
      .on("value", snapshot => {
        console.log("User data: ", snapshot.val());
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/chats/${chatID}`).off("value", onValueChange);
  }

  function newChat() {
  }

  function sendMessage(messageBody) {
    console.log(messageBody);
    if (messageBody !== "") {
      if (chatID === 0) {
        setChatID(Math.random().toString(36).slice(2));
        setChatsFirestore(friendID, chatID);
      }
      sendMessageDB(chatID, messageBody);
    }
  }


  return (
    <View style={{ height: "100%" }}>
      <ScrollView keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: "white" }}>
        <VStack>
          <HStack style={styles.messageContainer}>
            <Text style={{ color: "black" }}>CCCCCCCCCCCCC CCCCCCCCCCCCCC CCCCCCCCCCCCCCCCCC
              CCCCCCCCCCCCCCCCCCCCCC</Text>
          </HStack>
        </VStack>
      </ScrollView>
      <TextInput label={"Type a message ..."} activeUnderlineColor={"#0D253C"} multiline style={styles.textInput}
                 value={text} onChangeText={text => setText(text)}
                 right={<TextInput.Icon name="send" color={"#0D253C"} onPress={() => sendMessage(text)} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    position: "relative",
    backgroundColor: "#CCCCCC",
    fontFamily: "Barlow",
    fontSize: 18,
  },
  messageContainer: {
    padding: 15,
    justifyContent: "flex-end",
  },
});
