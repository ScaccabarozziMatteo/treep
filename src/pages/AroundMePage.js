import { HStack, View, VStack } from "native-base";
import { Alert, FlatList, Image, PermissionsAndroid, RefreshControl, ScrollView, StyleSheet, Text } from "react-native";
// you may also import just the functions or constants that you will use from this library
import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { TextInput } from "react-native-paper";
import Geolocation from "@react-native-community/geolocation";
import { Avatar, Button } from "react-native-ui-lib";
import { deletePosition, searchUsers, sharePosition } from "../api/UserApi";
import { showToast } from "../utils/Utils";
import LinearGradient from "react-native-linear-gradient";
import { Divider, ListItem } from "@ui-kitten/components";

// Position and radius
const nearbyRadius = 1;

export default function AroundMePage({ navigation }) {

  const [searchText, setSearchText] = useState();
  const [users, setUsers] = useState([]);
  const [latitude, setLatitude] = useState();
  const [userLatitude, setUserLatitude] = useState()
  const [userLongitude, setUserLongitude] = useState()
  const [longitude, setLongitude] = useState();
  const [userMarker, setUserMarker] = useState();

  useEffect(() => {
    Geolocation.getCurrentPosition((position) => {
      setLongitude(position.coords.longitude);
      setLatitude(position.coords.latitude);
    }, (error => showToast("error", "Position error", error.message)), { enableHighAccuracy: true, timeout: 10000 });
  }, []);


  const renderAvatar = (user) => (
    <View>
      <LinearGradient style={{ top: -20, width: 64, marginRight: 20, borderRadius: 15 }}
                      colors={["#376AED", "#49B0E2", "#9CECFB"]}>
        <View style={{ margin: 1.8, backgroundColor: "white", borderRadius: 13 }}>
          <Avatar animate imageStyle={{ borderRadius: 10, width: "84%", height: "84%", left: "8%", top: "8%" }}
                  label={user.first_name.charAt(0) + user.last_name.charAt(0)}
                  backgroundColor={"transparent"}
                  source={user.photoURL !== undefined ? { uri: user.photoURL } : null} size={60} />
        </View>
      </LinearGradient>
    </View>);


  function renderItem({ item }) {
    return (
      <ListItem
        style={{ height: 80 }}
        onPress={() => navigation.navigate("UserProfile", { userID: userMarker.userID })}
        title={() => <Text style={styles.title}>{item.first_name} {item.last_name}</Text>}
        description={() => <Text style={styles.description}>@{item.username}</Text>}
        accessoryLeft={renderAvatar(item)}
        ItemSeparatorComponent={Divider}
        accessoryRight={() => renderButton(item)}
      />
    );
  }

  function renderButton(user) {
    return (
      <Button style={styles.button} size={"medium"} label={"Show on Maps"}
              onPress={() => user.coords !== undefined ? setCoordinates(user, user.coords) : showToast('info', 'No position found', 'User does not share the position')} />
    );
  }

  function setCoordinates(user, coordinates) {
    setUserLatitude(coordinates.latitude);
    setUserLongitude(coordinates.longitude);
    setLatitude(coordinates.latitude)
    setLongitude(coordinates.longitude)
    setUserMarker(user)
    setSearchText(null)
    setUsers(null)
  }

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <HStack alignSelf={"center"}>
        <Button label={"Share position"}
                labelStyle={styles.labelButton}
                onPress={() => Geolocation.getCurrentPosition((position) => sharePosition(position), (error => showToast("error", "Position error", error.message)), {
                  enableHighAccuracy: true,
                  timeout: 10000,
                })
                }
                style={styles.shareButton} />
        <Button label={"Hide position"}
                labelStyle={styles.labelButton}
                onPress={() => deletePosition()}
                style={styles.cancelButton} />
      </HStack>

      <TextInput style={styles.textInput} value={searchText} onChangeText={async text => {
        setSearchText(text);
        setUsers(await searchUsers(text));
      }}
                 mode={"outlined"}
                 placeholder={"Search a user..."}
                 right={<TextInput.Icon name="magnify" color={"#0D253C"} onPress={null} />} />

      {users ? (
        <VStack style={{ maxHeight: 200 }}>
          <FlatList
            data={users}
            keyExtractor={(item) => item.userID}
            renderItem={renderItem}
          />
        </VStack>) : null}

      <VStack height={'100%'} margin={3}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ height: "70%", width: "100%" }}
          region={latitude !== undefined ? {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: nearbyRadius * 0.0922,
            longitudeDelta: nearbyRadius * 0.0421,
          } : null }
          showsUserLocation
        >
          {userLatitude !== undefined ? <Marker
          coordinate={{ latitude: userLatitude, longitude: userLongitude }}
          title={userMarker.first_name + ' ' + userMarker.last_name}
          description={"Last updated: " + new Date(userMarker.timestamp).toLocaleString()}
        /> : null}

        </MapView>
      </VStack>
    </View>

  );

}

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      alert("You can use the location");
    } else {
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}

const styles = StyleSheet.create({
  text: {
    color: "black",
    textAlign: "center",
    fontFamily: "Barlow",
  },
  textInput: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: "#3F799D",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 18,
    marginBottom: 18,
    marginRight: 10,
    marginLeft: 10,
    height: 50,
    width: "40%",
    alignSelf: "center",
  },
  cancelButton: {
    backgroundColor: "#E05D5B",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 18,
    marginBottom: 18,
    marginRight: 10,
    marginLeft: 10,
    height: 50,
    width: "40%",
    alignSelf: "center",
  },
  labelButton: {
    fontFamily: "Barlow",
    fontWeight: "700",
    fontSize: 18,
  },
  title: {
    marginLeft: 40,
    color: "#0D253C",
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 17,
    lineHeight: 20,
  },
  description: {
    fontFamily: "Barlow",
    marginLeft: 40,
    color: "#2D4379",
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.24,
  },
  button: {
    backgroundColor: "#386BED",
    borderColor: "transparent",
    borderRadius: 12,
  },
});
