import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { FlatList, Image, PermissionsAndroid, RefreshControl, StyleSheet, Text } from "react-native";
// you may also import just the functions or constants that you will use from this library
import React from "react";
import MapView, {PROVIDER_GOOGLE, Marker} from "react-native-maps";

// Position and radius
const latitude = 45.4642;
const longitude = 9.1900;
const nearbyRadius = 4;

export default function AroundMePage() {

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{flex: 1}}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: nearbyRadius*0.0922,
        longitudeDelta: nearbyRadius*0.0421
    }}
    showsUserLocation
    ><Marker
      onPress={requestLocationPermission}
    coordinate={{latitude: latitude, longitude: longitude}}
    title={'Example'}
    description={'This is a sample marker'}
    style={{backgroundColor: 'blue'}}
  />
    </MapView>
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

export async function requestLocationPermission()
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the location")
      alert("You can use the location");
    } else {
      console.log("location permission denied")
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
}
