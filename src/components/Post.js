import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import center from "native-base/src/theme/components/center";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { removeLike, removeWish, setLike, setWish } from "../api/TripApi";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {NavigationContainer} from "@react-navigation/native";



const Post = (props) => {

  const [postInfo, setPostInfo] = useState([
    {
      postID: props.postID,
      title: props.title,
      postUserImage: props.userImage,
      username: props.username,
      userID: props.userID,
      postImage: props.postImage,
      isLiked: props.isLiked,
      location: props.location,
      isWished: props.isWished,
      navigation: props.navigation,
    }
  ]);

  const [like, _setLike] = useState(postInfo.isLiked);
  const [wish, _setWish] = useState(postInfo.isWished);

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

  function moveToTripDetailsPage (nav, tripId) {
    nav.navigate("TripDetailsPage", {tripId});
  }

  function moveToUserProfilePage (nav, userID) {
    nav.navigate("UserProfile", {userID});
  }

  return(
   <View>
     {
       postInfo.map((data, index) => {

         return (
           <View style={{overflow: 'hidden', paddingBottom: 5}}>
             <View key={index} style={{
               backgroundColor: '#fff',
               width: '90%',
               left: '5%',
               borderRadius: 35,
               marginTop: 15,
               shadowColor: '#000',
               shadowOffset: {width: 1},
               shadowOpacity: 0.4,
               shadowRadius: 3,
               elevation: 5,
               height: 335,
             }}>

               <View style={{
                 position: 'relative',
                 justifyContent: 'center',
                 alignItems: 'center',
               }}>
                 <Image
                   source={{uri:data.postImage}}
                   style={{ width: "100%",
                     height: 300,
                     borderTopRightRadius: 35,
                     borderTopLeftRadius: 35,
                     borderBottomRightRadius: 35,

                   }}/>

               </View>

               <Image style={{
                 position: "absolute",
                 marginTop: 225,
                 height: 40,
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
                 paddingVertical: 12,
                 borderTopLeftRadius: 35,
                 borderBottomLeftRadius: 35,
                 borderBottomRightRadius: 35,
                 marginTop: 265,
                 backgroundColor: 'white',
                 borderColor: 'gray',
               }}>

                 <TouchableOpacity style={{flex: 1, paddingHorizontal: 10}}
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
                     {data.location}
                   </Text>
                 </View>

                 <View style={{flex: 2, flexDirection: "row", justifyContent: "space-around"}}>
                   <TouchableOpacity style={{paddingHorizontal: 5}}
                     onPress={like ? () => dislikePost(data.postID) : () => likePost(data.postID)}>
                     <Ionicons name={like ? "heart": "heart-outline"}
                               style={{fontSize: 25, color: like ? 'red' : 'black'}}/>
                   </TouchableOpacity>

                   <TouchableOpacity style={{paddingHorizontal: 5}}
                                     onPress={wish ? () => removeFromWishList(data.postID) : () => addToWishList(data.postID)}>
                    <FontAwesome name={wish ? "bookmark-o" : "bookmark"}
                                 style={{fontSize: 25, color: wish ? 'black' : "#386BED"}}/>
                   </TouchableOpacity>

                   <SimpleLineIcons name="options-vertical" style={{fontSize: 22, color: 'black', paddingHorizontal: 5}}/>

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

export default Post
