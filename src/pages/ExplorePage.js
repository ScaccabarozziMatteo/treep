import * as React from "react";
import { Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { HStack, VStack } from "native-base";
import { Button } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import { useState } from "react";


export default function ExplorePage({ navigation }) {

  const [searchText, setSearchText] = useState();

  return (
    <ScrollView backgroundColor={"white"}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <VStack padding={5}>
        <HStack>
          <TextInput style={styles.textInput} value={searchText} onChangeText={text => setSearchText(text)}
                     mode={"outlined"}
                     placeholder={"Search"}
                     right={<TextInput.Icon name="magnify" color={"#0D253C"} onPress={null} />} />
        </HStack>
        <HStack>
          {/* First column of buttons */}
          <VStack width={"52%"} paddingTop={7}>
            <HStack width={"100%"} paddingBottom={3}>
              <Button backgroundColor={"#3E8469"} style={styles.button}><Text style={styles.textButton}><Icon size={25}
                                                                                                              name={"newspaper"} />{"\n"}Trips</Text></Button>
            </HStack>
            <HStack width={"100%"}>
              <Button onPress={() => navigation.navigate({name: 'SearchUsers', params: { title: "People", typeSearch: "searchUsers" }})} backgroundColor={"#6AAE72"} style={styles.button}><Text style={styles.textButton}><Icon size={25}
                                                                                                              name={"people"} />{"\n"}People</Text></Button>
            </HStack>
          </VStack>

          {/* Second column of buttons */}
          <VStack width={"53%"} paddingTop={7}>
            <HStack width={"100%"} paddingBottom={3}>
              <Button backgroundColor={"#69B09C"} style={styles.button}><Text style={styles.textButton}><Icon size={25}
                                                                                                              name={"rocket"} />{"\n"}Destinations</Text></Button>
            </HStack>
            <HStack width={"100%"}>
              <Button onPress={() => navigation.push("AroundMe")} backgroundColor={"#A9D571"} style={styles.button}><Text style={styles.textButton}><Icon size={25}
                                                                                                              name={"navigate"} />{"\n"}Around
                me</Text></Button>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: "100%",
  },
  button: {
    borderRadius: 20,
    height: 110,
    width: "90%",
    alignItems: "flex-end",
    textAlign: "left",
    justifyContent: "flex-start",
    elevation: 6,
  },
  textButton: {
    fontFamily: "Barlow",
    fontSize: 19,
    color: "white",
    textAlign: "left",
  },
});
