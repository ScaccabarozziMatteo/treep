import React, { useEffect, useState } from "react";

import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from "react-native";
import Post from "../components/Post";
import { getAll } from "../api/TripApi";


export default function HomePage({navigation}) {

  const [trips, setTrips] = useState(
    {coverPhoto: "",
              userPhoto: "",
              userID: "",
              name: "",
              username: "",
              title: "",
              postID: "",
              isLiked: false,
              isWished: false,
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
    <View backgroundColor={'white'}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <SafeAreaView>
          <FlatList
            keyExtractor={(item, index)=>index.toString()}
            data={trips}
            renderItem={({ item }) => (
              <Post title={item.title}
                    userImage={item.userPhoto}
                    postImage={item.coverPhoto}
                    isLiked={item.isLiked}
                    isWished = {item.isWished}
                    username={item.username}
                    name={item.name}
                    postID={item.postID}
                    userID ={item.userID}
                    navigation={navigation}
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
    fontFamily: "Barlow",
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
    color: 'black',
  }
});
