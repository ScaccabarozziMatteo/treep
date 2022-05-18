import * as React from "react";
import { useEffect, useState } from "react";
import { getAll, getTripById, removeLike, removeWish, setLike, setWish } from "../api/TripApi";
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function UserProfile({ navigation, route }) {

  const tripID = route.params.tripId;
  const [tripData, setTripData] = useState("");
  const [like, _setLike] = useState(false);
  const [wish, _setWish] = useState(false);

  useEffect(  () => {
    const getTripData = async () => {
      const tripData = await getTripById(tripID);
        setTripData(tripData);
        _setLike(tripData.isLiked);
        _setWish(tripData.isWished);
    };
    getTripData();
    }, []);

  function likePost(postID) {
    setLike(postID).then(_setLike(!like));
  }

  function dislikePost(postID) {
    removeLike(postID).then(_setLike(!like));
  }

  function addToWishList(postID){
    setWish(postID).then(_setWish(!wish));
  }

  function removeFromWishList(postID) {
    removeWish(postID).then(_setWish(!wish));
  }

  return (
    <SafeAreaView>
        <View style={styles.topPart}>
          <ImageBackground style={styles.coverImage} source={{uri: tripData.coverPhoto}} resizeMode='cover'>
            <View style={{
              flexDirection: "row",
              width: '100%',
              top: -70,
            }}>
              <TouchableOpacity style={{flex: 8, paddingHorizontal: 15}} onPress={() => {navigation.navigate("Home")}}>
                <View style={{backgroundColor: 'white', height: 40, width: 40, justifyContent: "center", borderRadius: 10}}>
                  <AntDesign name="arrowleft" color="red" style={{ alignSelf: "center", fontSize: 30 }}/>
                </View>
              </TouchableOpacity>
              {/*ADD TO WISHLIST*/}
              <TouchableOpacity style={{paddingHorizontal: 10}}
                                onPress={wish ? () => removeFromWishList(tripID) : () => addToWishList(tripID)}>
                <FontAwesome name={wish ? "bookmark" : "bookmark-o"}
                             style={{fontSize: 35, color: wish ? 'green' : "black"}}/>
              </TouchableOpacity>

              {/*LIKE THIS TRIP*/}
              <TouchableOpacity style={{paddingHorizontal: 10}}
                                onPress={like ? () => dislikePost(tripID) : () => likePost(tripID)}>
                <Ionicons name={like ? "heart": "heart-outline"}
                          style={{fontSize: 35, color: like ? 'red' : 'black'}}/>
              </TouchableOpacity>



            </View>


            <Text style={styles.title}> {tripData.title} </Text>
            <Text style={styles.locationText}> {tripData.location} </Text>

            {/* FOLLOW BUTTON*/}
            <TouchableOpacity style={styles.followButton}>
              <Text style={{
                textAlign: "center",
                fontFamily: "Barlow",
                color: 'white',
                fontSize: 15,
              }}>Follow</Text>
            </TouchableOpacity>

          </ImageBackground>
        </View>

        <View style={styles.bottomPart}>

        </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  coverImage: {
    flex: 1,
    justifyContent: "center",

  },
  topPart: {
    height: '40%',
  },
  bottomPart :{
    height: '60%',
  },
  title: {

    textAlign: "center",
    fontFamily: "Barlow",
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
  },
  locationText: {
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Barlow",
    color: 'white',
    fontSize: 12,
  },
  followButton: {
    width: '45%',
    height: 40,
    borderRadius: 30,
    backgroundColor: '#ee594f',
    alignSelf: "center",
    justifyContent: "center",
  }
});
