import * as React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { HStack, VStack } from "native-base";
import { ScrollView, TextField } from "native-base";
import { TextInput } from "react-native-paper";

export default function ChatPage({navigation}) {

  const [text, setText] = React.useState("");

  return (
    <View style={{height: '100%'}}>
      <ScrollView keyboardShouldPersistTaps={"handled"} style={{backgroundColor: 'white'}}>
        <VStack>
          <HStack style={styles.messageContainer}>
            <Text style={{color: 'black'}}>CCCCCCCCCCCCC CCCCCCCCCCCCCC CCCCCCCCCCCCCCCCCC CCCCCCCCCCCCCCCCCCCCCC</Text>
          </HStack>
        </VStack>
      </ScrollView>
      <TextInput label={'Type a message ...'} activeUnderlineColor={'red'} multiline style={styles.textInput} value={text} onChangeText={text => setText(text)} right={<TextInput.Icon name="send" />}/>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    position: 'relative',
    backgroundColor: '#CCCCCC',
    fontFamily: 'Barlow',
    fontSize: 18,
  },
  messageContainer: {
    padding: 15,
    justifyContent: "flex-end"
  }
})
