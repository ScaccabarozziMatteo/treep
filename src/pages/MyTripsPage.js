import React, { useEffect, useState } from "react";
import { HStack, Pressable, ScrollView, View, VStack } from "native-base";
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@rneui/base";
import { Button } from "react-native-paper";
import { getFirstPosts, getTripsFromUserWishList, getUserTrips } from "../api/TripApi";
import { currentUser } from "../api/UserApi";
import Post from "../components/Post";
import SmallPost from "../components/SmallPost";
import WishListComponent from "../components/WishListComponent";
import { SafeAreaConsumer } from "react-native-safe-area-context";

export default function MyTripsPage({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [wishList, setWishList] = useState([]);

  useEffect( () => {
    setTrips([]);
    getUserTrips(currentUser().uid)
      .then((response) => {
        setTrips(response);
      })
      .catch((err) => {console.log(err)})
    ;
  }, []);

  useEffect( () => {
    setTrips([]);
    getTripsFromUserWishList(currentUser().uid)
      .then((response) => {
        setWishList(response);
      })
      .catch((err) => {console.log(err)})
    ;
  }, []);

  const Separator = () => {
    return(
      <View
        style={{
          width: 20,
          backgroundColor: 'white',
        }}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <VStack style={styles.container}>
          <TouchableOpacity onPress={() => navigation.push("NewTrips")}>
            <Button
              icon={"plus"}
              uppercase={false}
              style={styles.topButton}
              labelStyle={styles.labelButton}
            >
              Create new trip
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.push("AroundMe")}>
            <Button
              icon={"google-maps"}
              uppercase={false}
              style={styles.topButton}
              labelStyle={styles.labelButton}
            >
              Users around me
            </Button>
          </TouchableOpacity>
        </VStack>

        {/* Latest trips */}
        <Text style={styles.text}>Latest Trips</Text>
        <View style={styles.body}>
          <FlatList
            horizontal={true}
            data={trips}
            renderItem={({ item }) => (
              <SmallPost
                title={item.title}
                userImage={item.userPhoto}
                postImage={item.coverPhoto}
                username={item.username}
                name={item.name}
                postID={item.postID}
                userID ={item.userID}
                navigation={navigation}
              />
            )}>
          </FlatList>
        </View>



        {/* Wishlist */}
        <Text style={styles.text}>Wishlist</Text>
        <SafeAreaView style={styles.body}>
          <FlatList
            horizontal={true}
            data={wishList}
            ItemSeparatorComponent={Separator}
            renderItem={({ item }) => (
              <WishListComponent
                title={item.title}
                userImage={item.userPhoto}
                postImage={item.coverPhoto}
                username={item.username}
                name={item.name}
                postID={item.postID}
                userID ={item.userID}
                navigation={navigation}
              />
            )}>
          </FlatList>

        </SafeAreaView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    width: "95%",
    margin: 15,
    alignSelf: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: 20,
    margin: 3,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    flex: 1,
    width: "99%",
    height: 38,
    alignSelf: "center",
    margin: 3,
  },
  container: {
    alignSelf: "center",
    width: "100%",
    backgroundColor: 'white',
    paddingTop: 0,
    padding: 10,
  },
  scrollView: {
    marginHorizontal: 1,
    backgroundColor: 'white'
  },
  topButton: {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 20,
    width: "100%",
    alignItems: "flex-start",
    shadowColor: 'rgba(82, 130, 255, 0.5)',
    elevation: 10,
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 1
  },
  labelButton: {
    fontFamily: "Barlow",
    fontWeight: "400",
    color: "black",
    fontSize: 22,
    lineHeight: 24,
  },
});
