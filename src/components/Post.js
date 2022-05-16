import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Icon, Avatar } from "react-native-elements";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import center from "native-base/src/theme/components/center";
import Fontisto from "react-native-vector-icons/Fontisto";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { removeLike, setLike } from "../api/TripApi";

const Post = (props) => {

  const [postInfo, setPostInfo] = useState([
    {
      postID: props.postID,
      title: props.title,
      postUserImage: props.userImage,
      username: props.username,
      postImage: props.postImage,
      isLiked: props.isLiked,
      location: props.location,
      likes: props.likes,
      description: props.description,
      status: props.status,
    }
  ]);

  const [like, _setLike] = useState(postInfo.isLiked);

  function likePost(postID) {
    setLike(postID).then(_setLike(!like))
  }

  function dislikePost(postID) {
    removeLike(postID).then(_setLike(!like))
  }

  return(
   <View>
     {
       postInfo.map((data, index) => {

         return (
           <View key={index} style={{
             paddingBottom: 10,
             borderBottomColor: 'gray',
             borderBottomWidth: 0.1,
           }}>
             <View style={{
               flexDirection: 'row',
               alignItems: 'center',
               justifyContent: "space-around",
               paddingVertical: 10,
             }}>

               {/* USER PHOTO BOX */}
               <Image source={{uri: data.postUserImage}} style={{ width: 40, height: 40, borderRadius: 100 }}/>


               {/* TITLE BOX */}
               <View>
                 <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
                   {data.title}
                 </Text>
               </View>

               {/* ACTIVE BOX */}
                <View>
                  <Fontisto name={data.status ? "radio-btn-active": "radio-btn-passive"} style={{fontSize: 25, color: 'black'}}/>
                </View>


             </View>

             <View style={{
               position: 'relative',
               justifyContent: 'center',
               alignItems: 'center',
             }}>
               <Image
                 source={{uri:data.postImage}}
                 style={{ width: "100%", height: 350, borderRadius:10,}}/>
               <View style={{

                 width: '100%',
                 alignItems: "center",
               }}>
                 <Text style={{color: 'black', padding: 10}}>
                   {data.description}
                 </Text>
               </View>
             </View>
             <View style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               alignContent: "center",
               flex: 1,
               paddingHorizontal: 30,
               paddingVertical: 10,
             }}>

               {/* USER BOX */}
               <View style={styles.box}>
                 <View style={{flexDirection: "row", justifyContent: "space-evenly", paddingHorizontal: 20, alignItems: "center"}}>
                   <FontAwesome name="user" style={{ color: "black", fontSize: 25, fontWeight: "bold", paddingHorizontal: 5}}/>
                   <Text style={styles.text}>{data.username}</Text>
                 </View>
               </View>

               {/* LIKE BOX */}
               <View style={styles.box}>
                 <TouchableOpacity
                   style={{flexDirection:"row", justifyContent:"space-evenly", paddingHorizontal: 40, paddingVertical: 3}}
                   onPress={like ? () => dislikePost(data.postID) : () => likePost(data.postID)}>
                   <Ionicons name={like ? "heart": "heart-outline"}
                              style={{fontSize: 20, color: like ? 'red' : 'black'}}/>
                   <Text style={styles.text}> {data.isLiked ? (like ? data.likes : data.likes-1) : (like ? data.likes+1 : data.likes)}</Text>
                 </TouchableOpacity>

               </View>

             </View>
             <View style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               paddingHorizontal: 30,

             }}>

               {/* LOCATION BOX*/}
               <View style={styles.box}>
                 <View style={{flexDirection: "row", justifyContent: "space-evenly", paddingHorizontal: 20}}>
                   <Ionicons name="location-sharp" style={{ color: "red", fontSize: 25 }}/>
                   <Text style={styles.text}>{data.location}</Text>
                 </View>
               </View>

               {/* ADD TO FAVOURITES BOX*/}
               <View style={styles.box}>
                 <Feather name="bookmark" style={{fontSize: 20, color: 'black', textAlign:"center", paddingVertical: 3}}/>
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
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    color: 'black',
  }
});

export default Post
