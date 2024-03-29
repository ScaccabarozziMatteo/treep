import * as React from "react";
import { useEffect, useState } from "react";
import { getTripById, removeLike, removeWish, setLike, setWish } from "../api/TripApi";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import TripInfoComponent from "../components/TripInfoComponent";
import TripPhotosComponent from "../components/TripPhotosComponent";
import ActivitiesComponent from "../components/ActivitiesComponent";
import {DetailsInfoContext} from "../contexts/DetailsInfoContext";
import { currentUser } from "../api/UserApi";

const Tab = createMaterialTopTabNavigator();

export default function TripDetailsPage({ navigation, route }) {

  const tripID = route.params.tripId;
  const [tripData, setTripData] = useState("");
  const [like, _setLike] = useState(false);
  const [wish, _setWish] = useState(false);
  const [l, setL] = useState(0);
  const [w, setW] = useState(0);

  const [_status, _setStatus] = useState(false);
  const [_startDate, _setStartDate] = useState(new Date());
  const [_endDate, _setEndDate] = useState(new Date());
  const [coverPhoto, setCoverPhoto] = useState(null);


  useEffect(  () => {
    const getTripData = async () => {
      const tripData = await getTripById(tripID);
        setTripData(tripData);
        _setLike(tripData.isLiked);
        _setWish(tripData.isWished);
        setL(tripData.likes.length);
        setW(tripData.wishes.length);
        _setStatus(tripData.status);
        _setStartDate(tripData.startDate);
        _setEndDate(tripData.endDate);
        setCoverPhoto(tripData.coverPhoto)
    };
    getTripData();
    }, [tripID, route.params.updateTrip]);

  function likePost(postID) {
    setLike(postID).then(_setLike(!like)).then(setL(l+1));
  }

  function dislikePost(postID) {
    removeLike(postID).then(_setLike(!like)).then(setL(l-1));
  }

  function addToWishList(postID){
    setWish(postID).then(_setWish(!wish)).then(setW(w+1));
  }

  function removeFromWishList(postID) {
    removeWish(postID).then(_setWish(!wish)).then(setW(w-1));
  }

  return (
    <SafeAreaView>
        <View style={styles.topPart}>
          <ImageBackground style={styles.coverImage} source={{uri: coverPhoto}} resizeMode='cover'>
            <View style={{
              flexDirection: "row",
              width: '100%',
              marginTop: 20,
            }}>
              <TouchableOpacity style={{flex: 8, paddingHorizontal: 15}} onPress={() => {navigation.navigate("Homepage")}}>
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
            <Text style={styles.locationText}> {tripData.name}, {tripData.region} </Text>

            {tripData.userID !== currentUser().uid ?

              /* FOLLOW BUTTON*/
              <TouchableOpacity style={styles.followButton}>
                <Text style={{
                  textAlign: "center",
                  fontFamily: "Barlow",
                  color: 'white',
                  fontSize: 15,
                }}>Follow</Text>
              </TouchableOpacity>

              :

              /* ADD ACTIVITY BUTTON*/

              <TouchableOpacity style={styles.followButton} onPress={() => navigation.push("AddActivity", {tripID, minDate: tripData.startDate, maxDate: tripData.endDate, type: 'existing_trip'})}>
                <Text style={{
                  textAlign: "center",
                  fontFamily: "Barlow",
                  color: 'white',
                  fontSize: 15,
                }}> + Add activity</Text>
              </TouchableOpacity>
            }

            <View style={styles.metrics}>
              <View style={{justifyContent: "center"}}>
                <Text style={styles.numbersAtTheTop}>{l}</Text>
                <Text style={{color: 'white'}}>Likes</Text>
              </View>
              <View style={{justifyContent: "center"}}>
                <Text style={styles.numbersAtTheTop}>0</Text>
                <Text style={{color: 'white'}}>Followers</Text>
              </View>
              <View style={{justifyContent: "center"}}>
                <Text style={styles.numbersAtTheTop}>{w}</Text>
                <Text style={{color: 'white'}}>Saves</Text>
              </View>
            </View>

          </ImageBackground>
        </View>

        <View style={styles.bottomPart}>
          <DetailsInfoContext.Provider value={{
            status: _status,
            startDate: _startDate.getDate().toString()+' / '+_startDate.getMonth().toString()+' / '+_startDate.getFullYear().toString(),
            endDate: _endDate.getDate().toString()+' / '+_endDate.getMonth().toString()+' / '+_endDate.getFullYear().toString(),
            trip: tripData,
            tripID: tripID
          }}>
            <Tab.Navigator>
              <Tab.Screen name="info" component={TripInfoComponent}/>
              <Tab.Screen name="photos" component={TripPhotosComponent}/>
              <Tab.Screen name="Activities" component={ActivitiesComponent}/>
            </Tab.Navigator>
          </DetailsInfoContext.Provider>
        </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  coverImage: {
    flex: 1,
  },
  topPart: {
    height: '40%',
  },
  bottomPart :{
    height: '60%',
  },
  title: {
    marginTop: '17%',
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
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: '7%',
    color: 'white',
    height: '20%',
  },
  numbersAtTheTop: {
    textAlign: "center",
    color: 'white',
    fontSize: 22,
    fontWeight: "bold"
  }
});
