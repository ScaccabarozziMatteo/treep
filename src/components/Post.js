// Here we can build the top navigation, creating all the cases
//Useless commit to see what happens


import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Icon, Avatar } from "react-native-elements";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import { red } from "react-native-reanimated/src/reanimated2/Colors";
import center from "native-base/src/theme/components/center";
import Fontisto from "react-native-vector-icons/Fontisto";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Post = (props) => {

  const postInfo = [
    {
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
  ]

  const [like, setLike] = useState(postInfo.isLiked);

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
                   onPress={setLike}>
                   <Ionicons name={like ? "heart": "heart-outline"}
                              style={{fontSize: 20, color: like ? 'red' : 'black'}}/>
                   <Text style={styles.text}> {like ? data.likes+1 : data.likes}</Text>
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