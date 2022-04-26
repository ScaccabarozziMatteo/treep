import * as React from "react";
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { HStack, Text, VStack } from "native-base";
import { Avatar } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "@ui-kitten/components";

export default function UserProfile({navigation, route}) {

  const userData = route.params.user;

  function badges() {
    return (
      <VStack alignItems={"center"}>
        <HStack justifyContent={"space-between"} alignContent={"stretch"} width={"80"}>
          <Icon name={"earth"} color={isActiveBadge(0)} size={40} />
          <Icon name={"airplane-takeoff"} color={isActiveBadge(1)} size={40} />
          <Icon name={"comment-text-outline"} color={isActiveBadge(2)} size={40} />
          <Icon name={"hand-heart"} color={isActiveBadge(3)} size={40} />
          <Icon name={"professional-hexagon"} color={isActiveBadge(4)} size={40} />
        </HStack>
      </VStack>
    );
  }

  function isActiveBadge(number) {
    if (userData !== "")
      if (userData.badges[number])
        return "green";
      else
        return "grey";
    else
      return "grey";
  }

  return (
    <ScrollView keyboardShouldPersistTaps={"handled"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <VStack justifyContent={"space-between"} alignContent={"stretch"}
                  style={{ padding: "3%", alignSelf: "center", backgroundColor: "white", margin: "3%" }}>
            <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}>
              <Avatar animate size={100} source={userData.photoURL !== null ? { uri: userData.photoURL } : null} />
              <VStack style={{ padding: 20, width: "60%" }}>

                <View>
                  {/* Show name*/}
                  <Text style={styles.title}>{userData.first_name + " " + userData.last_name}</Text>

                  {
                    /* Show username*/
                    (userData.username !== "" ? <Text style={{ color: "grey" }}>@{userData.username}</Text> : null)}
                </View>
              </VStack>
            </HStack>

            {/* Vanity metrics */}
            <VStack alignItems={"center"}>
              <HStack backgroundColor={"gray.100"} width={"70%"} alignItems={"center"}
                      justifyContent={"space-between"} alignContent={"stretch"}>
                <VStack alignItems={"center"}>
                  <Text style={styles.text}>Trips</Text>
                  <Text style={styles.text}>23</Text>
                </VStack>
                <VStack alignItems={"center"}>
                  <Text style={styles.text}>Follower</Text>
                  <Text style={styles.text}>100</Text>
                </VStack>
                <VStack alignItems={"center"}>
                  <Text style={{ color: "black", width: "105%" }}>Following</Text>
                  <Text style={styles.text}>140</Text>
                </VStack>
              </HStack>
            </VStack>

            {/* Bio */}
            <VStack>
              <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}>
                <Text style={styles.title}>About me</Text>

              </HStack>

              {
                // User bio
                (userData.bio ? <Text style={styles.text}>{userData.bio}</Text> : null)}
            </VStack>

            {/* Buttons*/}
            <HStack justifyContent={"space-between"} alignContent={"stretch"}>
              <HStack>
                <Button>Message</Button>
              </HStack>
              <HStack>
                <Button>Follow</Button>
              </HStack>
            </HStack>

            {/* Badges*/}
            <VStack>
              <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}>
                <Text style={styles.title}>My Badges</Text>
              </HStack>
              {badges()}
            </VStack>
          </VStack>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // row
    alignItems: "center",
  },
  boxButton: {
    paddingTop: 20,
    width: "40%",
    alignSelf: "center",
  },
  input: {
    color: "black",
    width: "80%",
    alignSelf: "center",
  },
  text: {
    color: "black",
  },
  title: {
    color: "black",
    fontWeight: "700",
    width: "90%",
    marginTop: 30,
  },
});

