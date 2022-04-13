import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { FlatList, Image, RefreshControl, StyleSheet, Text } from "react-native";
import React from "react";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";

export default function AroundMePage() {

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{flex: 1}}
      region={{
        latitude: 42.882004,
        longitude: 74.582748,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }}
    showsUserLocation
    />
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
