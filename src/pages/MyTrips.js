import { Pressable, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { VStack } from "native-base";
import { Button } from "react-native-paper";
import React from "react";

export default function MyTrips({ navigation }) {


  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <VStack style={styles.container}>
        <TouchableOpacity onPress={() => navigation.push("NewTrips")}>
          <Button color={"grey"} icon={"plus"} uppercase={false}
                  style={styles.button} labelStyle={styles.labelButton} label={"Create new trip"}>Create new
            trip</Button>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.push("AroundMe")}>
          <Button color={"grey"} icon={"google-maps"} uppercase={false} style={styles.button}
                  labelStyle={styles.labelButton} label={"Create new trip"}>Around me</Button>
        </TouchableOpacity>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "100%",
    paddingTop: 0,
    padding: 30,
  },
  button: {
    backgroundColor: "#D2D2D2",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 20,
    width: "100%",
    alignItems: "flex-start",
  },
  labelButton: {
    fontFamily: "Barlow",
    fontWeight: "400",
    color: "black",
    fontSize: 22,
    lineHeight: 24,
  },
});
