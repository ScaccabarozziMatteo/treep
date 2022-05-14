import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { HStack, ScrollView, VStack } from "native-base";
import { Button } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import { useState } from "react";


export default function ExplorePage() {

  const [searchText, setSearchText] = useState();

  return (
    <ScrollView>
      <VStack padding={5}>
        <HStack>
          <TextInput style={styles.textInput} value={searchText} onChangeText={text => setSearchText(text)} mode={"outlined"}
                     placeholder={"Search"}
                     right={<TextInput.Icon name="magnify" color={"#0D253C"} onPress={null} />} />
        </HStack>
        <HStack>
          {/* First column of buttons */}
          <VStack width={'52%'} paddingTop={7}>
            <HStack width={'100%'} paddingBottom={3}>
              <Button style={styles.button}><Text style={styles.textButton}><Icon size={25} name={'newspaper'}/>{'\n'}Trips</Text></Button>
            </HStack>
            <HStack width={'100%'}>
              <Button style={styles.button}><Text style={styles.textButton}><Icon size={25} name={'people'}/>{'\n'}People</Text></Button>
            </HStack>
          </VStack>
          {/* Second column of buttons */}
          <VStack width={'53%'} paddingTop={7}>
            <HStack width={'100%'}>
              <Button style={styles.button}><Text style={styles.textButton}><Icon size={25} name={'newspaper'}/>{'\n'}Trips</Text></Button>
            </HStack>
            <HStack width={'100%'}>
              <Button style={styles.button}><Text style={styles.textButton}><Icon size={25} name={'newspaper'}/>{'\n'}Trips</Text></Button>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: '100%'
  },
  button: {
    backgroundColor: '#3E8469',
    borderRadius: 20,
    height: 110,
    width: '90%',
    alignItems: 'flex-end',
    textAlign: "left",
    justifyContent: 'flex-start',

  },
  textButton: {
    fontFamily: 'Barlow',
    fontSize: 19,
    color: 'white',
    textAlign: "left",
  }
})
