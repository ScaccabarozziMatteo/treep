import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { FlatList, Image, RefreshControl, StyleSheet, Text } from "react-native";
import React from "react";

export default function AroundMePage() {

  return (
    <View>
      <Text style={styles.text}>This is the AroundMe page</Text>
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
