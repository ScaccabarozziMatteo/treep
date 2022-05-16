import React, { useEffect, useState } from "react";

import { TripCollection } from "../../api/FirebaseApi";
import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { FlatList, Text, StyleSheet, RefreshControl, Image, ScrollView, TouchableOpacity } from "react-native";
import FullWidthImage from "react-native-fullwidth-image";
import Post from "../../components/Post";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomePage() {

  const [trips, setTrips] = useState(
    {description: "" ,
      coverPhoto: "",
    }
  )

  useEffect( () => {
    TripCollection.getAll().then(
      response => {
        setTrips(response);
      }
    )}, []
  );

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true);

    TripCollection.getAll().then(
      response => {
        setTrips(response);
      }
    );

    setRefreshing(false);
  }

  return (
    <View>
      <SafeAreaView>
        <FlatList
          keyExtractor={(item, index)=>index.toString()}
          data={trips}

          renderItem={({item})=>(
            <Post title={item.description} userImage={item.coverPhoto} postImage={item.coverPhoto} likes={item.likes} isLiked="false"/>

          )}
          refreshControl = {<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff00ff']}
          />}
        />

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {

  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
    color: 'black',
  }
});
