// Here we can build the top navigation, creating all the cases

import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Icon, Avatar } from "react-native-elements";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

const Post = (props) => {

  const postInfo = [
    {
      postTitle: props.title,
      postUserImage: props.userImage,
      postImage: props.postImage,
      likes: props.likes,
      isLiked: props.isLiked,
    }
  ]

  return(
   <View>
     {
       postInfo.map((data, index) => {
         const [like, setLike] = useState(data.isLiked);
         return (
           <View key={index} style={{
             paddingBottom: 10,
             borderBottomColor: 'gray',
             borderBottomWidth: 0.1,
           }}>
             <View style={{
               flexDirection: 'row',
               alignItems: 'center',
               justifyContent: 'space-between',
               padding: 15,
             }}>
               <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <Image source={{uri: data.postUserImage}} style={{ width: 40, height: 40, borderRadius: 100 }}/>
                 <View style={{paddingLeft: 5}}>
                   <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
                     {data.postTitle}
                   </Text>
                 </View>
               </View>
               <Feather name="more-vertical" style={{ fontSize: 20 }}/>
             </View>

             <View style={{
               position: 'relative',
               justifyContent: 'center',
               alignItems: 'center',
             }}>
               <Image
                 source={{uri:data.postImage}}
                 style={{ width: "100%", height: 400}}/>
             </View>
             <View style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               paddingHorizontal: 12,
               paddingVertical: 15,
             }
             }>
               <View style={{flexDirection: 'row', alignItems:'center'}}>

                 <TouchableOpacity onPress={()=>setLike(!like)}>
                   <AntDesign name={like ? "heart": "hearto"}
                              style={{paddingRight: 10, fontSize: 20, color: like ? 'red' : 'black'}}/>
                 </TouchableOpacity>


                 <TouchableOpacity>
                   <Ionicons name="ios-chatbubble-outline" style={{fontSize: 20, paddingLeft: 10, color: 'black'}}/>
                 </TouchableOpacity>

                 <TouchableOpacity>
                   <Feather name="navigation" style={{fontSize: 20, color: 'black'}}/>
                 </TouchableOpacity>

               </View>
               <Feather name="bookmark" style={{fontSize: 20, color: 'black'}}/>
             </View>
             <View style={{paddingHorizontal: 15}}>
               <Text style={{color: 'black'}}>
                 Liked by{like ? " you and" : ""} {''}
                 {data.likes} others
               </Text>
               <Text style={{opacity: 0.4, paddingVertical: 2, color: 'black'}}>
                 View all comments
               </Text>
             </View>
           </View>
         )
       })
     }
   </View>
  )
}

export default Post
