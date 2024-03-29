import * as React from "react";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View, TouchableOpacity,
} from "react-native";
import { HStack, VStack } from "native-base";
import { Avatar, Button } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  addFollow,
  currentUser,
  getFollowers,
  getFollowings, getTrips,
  getUserDataWithID,
  removeFollow,
} from "../api/UserApi";
import LinearGradient from "react-native-linear-gradient";

export default function UserProfile({ navigation, route }) {

  const userID = route.params.userID;
  const [userData, setUserData] = useState("");
  const [followers, setFollowers] = useState("");
  const [followings, setFollowings] = useState("");
  const [trips, setTrips] = useState("");
  const [dummyState, setDummyState] = useState(0.1); // Trigger that enable the followers/followings check

  useEffect(() => {
    const updateValue = async () => {
      const userData = await getUserDataWithID(userID);
      const followers = await getFollowers(userID);
      const followings = await getFollowings(userID);
      const trips = await getTrips(userID);
      setUserData(userData);
      setFollowers(followers);
      setFollowings(followings);
      setTrips(trips);
    };
    updateValue();
    return () => {
      setUserData("")
    };
  }, [dummyState, userID]);

  useEffect(() => {
    return () => {
      setUserData("")
    };    }, []);

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

  function buttons() {
    if (currentUser() != null)
      return (
        <HStack justifyContent={"space-between"} alignContent={"space-around"}>
          <HStack>
            {!followers.includes(currentUser().uid) ?
              <Button style={styles.button} labelStyle={styles.buttonText}
                      onPress={async () => setDummyState(await addFollow(currentUser().uid, userID))}
                      label={"Follow"} /> :
              <Button style={styles.button} labelStyle={styles.buttonText}
                      onPress={async () => setDummyState(await removeFollow(currentUser().uid, userID))}
                      label={"Unfollow"} />
            }
          </HStack>
          <HStack>
            <Button onPress={() => navigation.navigate({
              name: "ChatPage",
              params: { titlePage: "Chat with " + userData.first_name, friendID: userID },
            })} style={styles.button} labelStyle={styles.buttonText} label={"Message"} />
          </HStack>
        </HStack>
      );
    else
      return (
        <HStack justifyContent={"center"} alignContent={"center"}>
          <HStack>
            <Button style={styles.button} onPress={() => navigation.navigate("Profile")} label={""}><Text
              style={styles.buttonText}>LOGIN to interact with {userData.first_name}</Text></Button>
          </HStack>
        </HStack>
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
    <ScrollView keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: "white" }}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <VStack>
          <VStack justifyContent={"space-between"} alignContent={"stretch"}
                  style={styles.mainContainer}>
            <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}
                    style={{ paddingBottom: 20, paddingTop: 10 }}>
              <LinearGradient style={{ borderRadius: 29 }} colors={["#376AED", "#49B0E2", "#9CECFB"]}>
                <View style={{ margin: 1.8, backgroundColor: "white", borderRadius: 28 }}>
                  <Avatar backgroundColor={"transparent"}
                          imageStyle={{ borderRadius: 22, width: "84%", height: "84%", left: "8%", top: "8%" }}
                          label={userData !== "" ? userData.first_name.charAt(0) + userData.last_name.charAt(0) : null}
                          animate size={90} source={userData.photoURL !== null ? { uri: userData.photoURL } : null} />
                </View>
              </LinearGradient>
              <VStack style={{ width: "60%" }}>
                <View>
                  {
                    /* Show username*/
                    (userData.username !== "" ? <Text style={styles.username}>@{userData.username}</Text> : null)}
                </View>
                <View>
                  {/* Show name*/}
                  <Text
                    style={styles.name}>{userData !== "" ? userData.first_name + " " + userData.last_name : null}</Text>
                </View>
                <View>
                  {/* Show name*/}
                  <Text style={styles.userTitle}>Explorer</Text>
                </View>
              </VStack>
            </HStack>


            {/* Buttons*/}
            {buttons()}

            {/* Bio */}
            <VStack>
              <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}>
                <Text style={styles.aboutMeTitle}>About me</Text>

              </HStack>

              {
                // User bio
                (userData.bio ? <Text style={styles.aboutMeText}>{userData.bio}</Text> : null)}
            </VStack>


            {/* Vanity metrics */}
            <VStack alignItems={"center"}>
              <HStack
                      shadowColor={'#000'}
                      shadowOffset={1}
                      shadowOpacity={0.4}
                      shadowRadius={3}
                      elevation={5}
                      backgroundColor={"white"}
                      top={41}
                      borderColor={"black"}
                      borderWidth={0.5}
                      borderRadius={12}
                      width={"80%"} paddingLeft={5} paddingRight={5} paddingBottom={1} paddingTop={1}
                      alignItems={"center"}
                      justifyContent={"space-between"} alignContent={"stretch"}>
                <VStack alignItems={"center"}>
                  <TouchableOpacity onPress={null} style={{ alignItems: "center" }}>
                    <Text style={styles.numberVanity}>{trips.length}</Text>
                    <Text style={styles.textVanity}>Trips</Text>
                  </TouchableOpacity>
                </VStack>
                <VStack alignItems={"center"}>
                  <TouchableOpacity onPress={() => navigation.navigate({
                    name: "Follow",
                    params: { title: userData.first_name + "'s followings", userId: userID, type: "followings" },
                  })} style={{ alignItems: "center" }}>
                    <Text style={styles.numberVanity}>{followings.length}</Text>
                    <Text style={styles.textVanity}>Following</Text>
                  </TouchableOpacity>
                </VStack>
                <VStack alignItems={"center"}>
                  <TouchableOpacity onPress={() => navigation.navigate({
                    name: "Follow",
                    params: { title: userData.first_name + "'s followers", userId: userID, type: "followers" },
                  })} style={{ alignItems: "center" }}>
                    <Text style={styles.numberVanity}>{followers.length}</Text>
                    <Text style={styles.textVanity}>Followers</Text>
                  </TouchableOpacity>
                </VStack>
              </HStack>
            </VStack>
          </VStack>

          {/* Badges*/}
          <VStack>
            <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"} marginTop={5}>
              <Text style={styles.title}/>
            </HStack>
            {badges()}
          </VStack>
        </VStack>
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
  name: {
    fontFamily: "Avenir",
    color: "#0D253C",
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 10,
  },
  aboutMeTitle: {
    fontFamily: "Avenir",
    color: "#0D253C",
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 25,
    width: "90%",
    marginTop: 20,
    marginBottom: 6,
  },
  mainContainer: {
    padding: "4%",
    maxWidth: "85%",
    alignSelf: "center",
    backgroundColor: "white",
    margin: "3%",
    shadowColor: "rgba(82, 130, 255, 0.5)",
    shadowOffset: {width: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 8,
    borderRadius: 16,
  },
  button: {
    backgroundColor: "#386BED",
    borderColor: "transparent",
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: "Barlow",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 10,
    paddingRight: 10,
  },
  username: {
    color: "#2D4379",
    fontFamily: "Barlow",
    marginBottom: 5,
    fontWeight: "500",
    letterSpacing: -0.24,
    lineHeight: 17,
    fontSize: 14,
  },
  userTitle: {
    color: "#376AED",
    fontFamily: "Barlow",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
  numberVanity: {
    color: "black",
    fontFamily: "Barlow",
    lineHeight: 22,
    fontSize: 20,
  },
  textVanity: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Barlow",

  },
  aboutMeText: {
    color: "#2D4379",
    fontFamily: "Barlow",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
  },
});

