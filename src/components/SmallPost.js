import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import center from "native-base/src/theme/components/center";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getTripById, removeLike, removeWish, setLike, setWish } from "../api/TripApi";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { currentUser } from "../api/UserApi";


const SmallPost = (props) => {

  const [postInfo, setPostInfo] = useState([
    {
      postID: props.postID,
      title: props.title,
      postUserImage: props.userImage,
      username: props.username,
      userID: props.userID,
      postImage: props.postImage,
      name: props.name,
      navigation: props.navigation,
    }
  ]);

  function moveToTripDetailsPage (nav, tripId) {
    nav.navigate("TripDetailsPage", {tripId});
  }

  function moveToUserProfilePage (nav, userID) {
    if(userID == currentUser().uid){
      nav.navigate("ProfilePage");
    } else {
      nav.navigate("UserProfile", {userID});
    }
  }

  return(
    <View>
      {
        postInfo.map((data, index) => {

          return (
            <View key={index} style={{overflow: 'hidden', paddingBottom: 5}}>
              <View  style={{
                backgroundColor: '#fff',
                width: 220,
                height: 180,
                borderRadius: 35,
                shadowColor: '#000',
                shadowOffset: {width: 1},
                shadowOpacity: 0.4,
                shadowRadius: 3,
                elevation: 5,

              }}>

                <View style={{
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Image
                    source={{uri:data.postImage}}
                    style={{ width: "100%",
                      height: 150,
                      borderTopRightRadius: 35,
                      borderTopLeftRadius: 35,
                      borderBottomRightRadius: 35,

                    }}/>

                </View>

                <Image style={{
                  position: "absolute",
                  marginTop: 90,
                  height: 30,
                  width: '100%',
                  flexDirection: "row",
                  borderBottomRightRadius: 50,
                  overlayColor: 'white',
                }}>
                </Image>

                <View style={{
                  position: "absolute",
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderTopLeftRadius: 35,
                  borderBottomLeftRadius: 35,
                  borderBottomRightRadius: 35,
                  marginTop: 120,
                  backgroundColor: 'white',
                }}>

                  <TouchableOpacity style={{flex: 1, paddingHorizontal: 5}}
                                    onPress={() => moveToUserProfilePage(data.navigation, data.userID)}>
                    <Image source={{uri: data.postUserImage}} style={{ width: 40, height: 40, borderRadius: 100 }}/>
                  </TouchableOpacity>


                  <View style={{flex: 3}}>
                    <Text style={styles.text} onPress={() => moveToTripDetailsPage(data.navigation, data.postID)}>
                      {data.title}
                    </Text>
                    <Text style={{
                      fontSize: 15,
                      textAlignVertical: "center",
                      color: 'black',
                      opacity: 0.4,
                    }}>
                      {data.name}
                    </Text>
                  </View>
                </View>

              </View>
            </View>
          )
        })
      }
    </View>

  )
}

const styles = StyleSheet.create({
  box: {
    borderStyle: "solid",
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    elevation: 2,
    backgroundColor: '#FFE4C4',
    alignItems: "center",
    height: 30,
    width: '47%',

  },
  text: {
    fontFamily: "Barlow",
    fontSize: 15,
    textAlignVertical: "center",
    color: 'black',
  }
});

export default SmallPost
