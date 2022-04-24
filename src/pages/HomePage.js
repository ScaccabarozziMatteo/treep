import React, { useEffect, useState } from "react";

import { TripCollection, UserCollection } from "../api/FirebaseApi";
import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { FlatList, Text, StyleSheet, RefreshControl, Image, ScrollView, TouchableOpacity } from "react-native";
import Post from "../components/Post";


export default function HomePage() {

  const [trips, setTrips] = useState(
    {description: "" ,
              coverPhoto: "",
              userPhoto: "",
              userID: "",
              location: "",
    }
  )

  const [userData, setUserData] = useState(
    {
      photoURL: "",
      username: "",
    }
  )
  const [updatedTrips, setUpdatedTrips] = useState(
    {description: "" ,
      coverPhoto: "",
      userPhoto: "",
      userID: "",
      location: "",
      photoURL: "",
      username: "",
    }
  )



  useEffect( () => {
    TripCollection.getAll().then(
      response => {
        setTrips(response);
        response.forEach((t) => {
            UserCollection.getUserById(t.userID).then(r => {
              setUserData([...userData, r]);
            },
              console.log(userData),
              );
        });

      });
    }, []
  );



  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true);

    TripCollection.getAll().then(
      response => {

        setTrips(response);
        response.forEach((t) => {
          UserCollection.getUserById(t.userID).then(r => {
            setUserData([...userData, r]);
          });
        });
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
              <Post title={item.description}
                    userImage={item.photoURL}
                    postImage={item.coverPhoto}
                    isLiked={false}
                    username={item.username}
                    location={item.location}
                    likes={item.likes}
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
