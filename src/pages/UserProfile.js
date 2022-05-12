import * as React from "react";
import { useEffect, useState } from "react";
import { Keyboard, Text, ScrollView, StatusBar, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { HStack, VStack } from "native-base";
import { Avatar } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "@ui-kitten/components";
import { addFollow, currentUser, getFollowers, getFollowings, removeFollow } from "../api/UserApi";

export default function UserProfile({ navigation, route }) {

  const userData = route.params.user;
  const userID = route.params.userID;
  const [followers, setFollowers] = useState('');
  const [followings, setFollowings] = useState('');
  const [dummyState, setDummyState] = useState(0.1); // Trigger that enable the followers/followings check

  useEffect(() => {
    const updateValue = async () => {
      const followers = await getFollowers(userID);
      const followings = await getFollowings(userID);
      setFollowers(followers);
      setFollowings(followings);
    };
    updateValue();
  }, [dummyState]);

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
        <HStack justifyContent={"space-between"} alignContent={"stretch"}>
          <HStack>
            {!followers.includes(currentUser().uid) ?
              <Button style={styles.button} onPress={async () => setDummyState(await addFollow(currentUser().uid, userID))}><Text style={styles.textButton}>Follow</Text></Button> :
              <Button style={styles.button} onPress={async () => setDummyState(await removeFollow(currentUser().uid, userID))}><Text style={styles.textButton}>Unfollow</Text></Button>
            }
          </HStack>
          <HStack>
            <Button style={styles.button} >Message</Button>
          </HStack>
        </HStack>
      );
    else
      return (
        <HStack justifyContent={"center"} alignContent={"center"}>
          <HStack>
            <Button onPress={() => navigation.navigate("Profile")}>LOGIN to interact with {userData.first_name}</Button>
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
    <ScrollView keyboardShouldPersistTaps={"handled"} style={{backgroundColor: 'white'}}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <VStack>
          <VStack justifyContent={"space-between"} alignContent={"stretch"}
                  style={styles.mainContainer}>
            <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"} style={{paddingBottom: 20, paddingLeft: 20, paddingTop: 20}}>
              <Avatar animate size={100} source={userData.photoURL !== null ? { uri: userData.photoURL } : null} />
              <VStack style={{ width: "60%" }}>
                <View>
                {
                  /* Show username*/
                  (userData.username !== "" ? <Text style={styles.username}>@{userData.username}</Text> : null)}
                </View>
                <View>
                  {/* Show name*/}
                  <Text style={styles.name}>{userData.first_name + " " + userData.last_name}</Text>
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
                (userData.bio ? <Text style={styles.text}>{userData.bio}</Text> : null)}
            </VStack>


            {/* Vanity metrics */}
            <VStack alignItems={"center"}>
              <HStack backgroundColor={"white"} width={"70%"} alignItems={"center"}
                      justifyContent={"space-between"} alignContent={"stretch"}>
                <VStack alignItems={"center"}>
                  <Text style={styles.numberVanity}>23</Text>
                  <Text style={styles.textVanity}>Trips</Text>
                </VStack>
                <VStack alignItems={"center"}>
                  <Text style={styles.numberVanity}>{followers.length}</Text>
                  <Text style={styles.textVanity}>Followers</Text>
                </VStack>
                <VStack alignItems={"center"}>
                  <Text style={styles.numberVanity}>{followings.length}</Text>
                  <Text style={styles.textVanity}>Followings</Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>

          {/* Badges*/}
          <VStack>
            <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}>
              <Text style={styles.title}>My Badges</Text>
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
    fontFamily: 'Avenir',
    color: "#0D253C",
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 25,
    marginTop: 5
  },
  aboutMeTitle: {
    fontFamily: 'Avenir',
    color: "#0D253C",
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 25,
    width: "90%",
    marginTop: 30,
  },
  mainContainer: {
    padding: "3%",
    alignSelf: "center",
    backgroundColor: "white",
    margin: "3%",
    shadowColor: "rgba(82, 130, 255, 0.6)",
    elevation: 8,
    borderRadius: 16,
    shadowOpacity: 0.2
  },
  button: {
    backgroundColor: "#386BED",
    borderColor: 'transparent',
    borderRadius: 12,
  },
  username: {
    color: "#2D4379",
    fontFamily: 'Barlow',
    fontWeight: 'bold',
    letterSpacing: -0.24,
    lineHeight: 17,
    fontSize: 14
  },
  userTitle: {
    color: '#376AED',
    marginTop: 7,
    fontSize: 16,
    lineHeight: 20
  },
  numberVanity: {
    color: 'black',
    fontFamily: 'Barlow',
    lineHeight: 22,
    fontSize: 20
  },
  textVanity: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontFamily: 'Barlow',

  },
  textButton: {
    color: 'black'
  }
});

