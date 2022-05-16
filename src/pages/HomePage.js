import React, { useEffect, useState } from "react";

import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import {
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
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
              postID: "",
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
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <SafeAreaView>
          <FlatList
            keyExtractor={(item, index)=>index.toString()}
            data={trips}
            renderItem={({ item }) => (
              <Post title={item.title}
                    userImage={item.photoURL}
                    postImage={item.coverPhoto}
                    isLiked={item.isLiked}
                    username={item.username}
                    location={item.location}
                    likes={item.likes.length}
                    description={item.description}
                    status={item.status}
                    postID={item.postID}
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
