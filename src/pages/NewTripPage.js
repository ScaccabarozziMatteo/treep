import { View } from "native-base";
import { StyleSheet, Text } from "react-native";
import React from "react";

export default function NewTripPage() {
  return (
    <View>
      <Text style={styles.text}>This is the New Trip page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
    color: 'black',
  }
});
