import * as React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { HStack, VStack } from "native-base";
import { ScrollView, TextField } from "native-base";
import { TextInput } from "react-native-paper";
import { useEffect } from "react";
import { retrieveSpecificChat, sendMessageDB, setChatsFirestore } from "../api/ChatAPI";
import { firebase } from "@react-native-firebase/database";
import { currentUser } from "../api/UserApi";


export default function ChatPage({ route }) {

  const [text, setText] = React.useState("");
  const [chatID, setChatID] = React.useState('0');
  const [friendID, setFriendID] = React.useState(route.params.friendID);
  const [chat, setChat] = React.useState('');

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
          setChat(Object.values(snapshot.val()))
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/chats/${chatID}`).off("value", onValueChange);
  }

  function sendMessage(messageBody) {
    setText('')
    if (messageBody !== "") {
      if (chatID === 0) {
        const ID = Math.random().toString(36).slice(2)
        setChatID(ID);
        setChatsFirestore(friendID, ID);
        sendMessageDB(ID, messageBody);
      }
      else
        sendMessageDB(chatID, messageBody);
    }
  }


  return (
    <View style={{ height: "100%", backgroundColor: 'white' }}>
      <View keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: "white" }}>
        <VStack height={'100%'} marginBottom={-20} justifyContent={'flex-end'}>
        <HStack>
          <FlatList
            inverted
            data={chat}
            renderItem={({ item }) => <Text style={item.userID === currentUser().uid ? styles.messageCurrentUser : styles.messageFriendUser}>{item.body}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          </HStack>
          {console.log(chat)}
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
    width: '100%',
    bottom: 0,
    backgroundColor: "#CCCCCC",
    fontFamily: "Barlow",
    fontSize: 18,
  },
  messageFriendUser: {
    fontFamily: 'Barlow',
    color: 'black',
    textAlign: 'left',
    alignSelf: 'flex-start',
    padding: 12,
    maxWidth: '80%',
    fontSize: 16,
    backgroundColor: '#67B9A5',
    borderRadius: 18,
    margin: 5
  },
  messageCurrentUser: {
    fontFamily: 'Barlow',
    color: 'black',
    textAlign: 'right',
    alignSelf: 'flex-end',
    padding: 12,
    maxWidth: '80%',
    fontSize: 16,
    backgroundColor: '#B4E0E2',
    borderRadius: 18,
    margin: 5

  }
});
