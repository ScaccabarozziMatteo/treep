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
import { getAll, getFirstPosts, getNextBatch } from "../api/TripApi";


export default function HomePage({navigation}) {

  const [trips, setTrips] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect( () => {
    setTrips([]);
    getFirstPosts()
      .then((response) => {
        setTrips(response.trips);
        setLastKey(response.lastKey);
      })
      .catch((err) => {console.log(err)})
    ;
    }, []);

  const fetchMorePosts = (key) => {
    if(key != null) {

      setRefreshing(true);
      getNextBatch(key)
        .then((res) => {
          setLastKey(res.lastKey);
          //Add posts to the old ones
          setTrips(trips.concat(res.trips));
          setRefreshing(false);
        })
        .catch((err) => {
          console.log(err);
          setRefreshing(false);
        });
    }
  }

  return (
    <View backgroundColor={'white'}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <SafeAreaView>
          <FlatList
            keyExtractor={(item, index)=>{return index.toString()}}
            data={trips}
            renderItem={({ item }) => (
              <Post
                    title={item.title}
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
              onRefresh={() => getFirstPosts}
              colors={['#ff00ff']}
            />}
            onEndReached={() => fetchMorePosts(lastKey)}
            onEndReachedThreshold={0.5}
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
