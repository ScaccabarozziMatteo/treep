import React, { useEffect, useState } from "react";

import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { FlatList, Text, StyleSheet, RefreshControl, Image, ScrollView, TouchableOpacity } from "react-native";
import Post from "../components/Post";
import { getAll } from "../api/TripApi";


export default function HomePage() {

  const [trips, setTrips] = useState(
    {description: "" ,
              coverPhoto: "",
              userPhoto: "",
              userID: "",
              location: "",
              photoURL: "",
              username: "",
              title: "",
              status: false,
    }
  )

  useEffect( () => {
    getAll().then(
      response => {
        setTrips(response);

      });
    }, []
  );


  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true);

    getAll().then(
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
            renderItem={({ item }) => (
              <Post title={item.title}
                    userImage={item.photoURL}
                    postImage={item.coverPhoto}
                    isLiked={false}
                    username={item.username}
                    location={item.location}
                    likes={item.likes}
                    description={item.description}
                    status={item.status}
              />
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
