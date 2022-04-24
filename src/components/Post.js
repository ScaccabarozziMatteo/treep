// Here we can build the top navigation, creating all the cases
//Useless commit to see what happens


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
      postUsername: props.username,
      postImage: props.postImage,
      isLiked: props.isLiked,
      location: props.location,
      likes: props.likes,
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
                     {data.postUsername}
                   </Text>
                 </View>
               </View>

             </View>

             <View style={{
               position: 'relative',
               justifyContent: 'center',
               alignItems: 'center',
             }}>
               <Image
                 source={{uri:data.postImage}}
                 style={{ width: "100%", height: 400, borderRadius:10,}}/>
             </View>
             <View style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               paddingHorizontal: 30,
               paddingVertical: 10,
             }}>

               <View style={styles.box}>
                 <Text style={styles.text}>{data.postTitle}</Text>
               </View>

               <View style={styles.box}>
                 <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-evenly"}} onPress={()=>setLike(!like)}>
                   <AntDesign name={like ? "heart": "hearto"}
                              style={{fontSize: 20, color: like ? 'red' : 'black', textAlign:"center"}}/>
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

               <View style={styles.box}>
                 <Text style={styles.text}>{data.location}</Text>
               </View>
               <View style={styles.box}>
                 <Feather name="bookmark" style={{fontSize: 20, color: 'black', textAlign:"center"}}/>
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
    height: 30,
    width: '45%',
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
