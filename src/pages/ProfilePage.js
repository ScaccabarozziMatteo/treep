import * as React from "react";
import { StyleSheet, View, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { Divider, Text, HStack, VStack } from "native-base";
import { Avatar, Card } from "react-native-ui-lib";
import { Button } from "@ui-kitten/components";
import {
  currentUser,
  getUserData,
  setDescriptionFirebase,
  setUsernameFirebase,
  UserCollection,
} from "../api/FirebaseApi";
import { showToast } from "../utils/Utils";
import { useEffect, useState } from "react";
import ModalPhoto from "../utils/ModalPhoto";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProfilePage() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState("");
  const [dummyUser, setDummyUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);

  const pencil = require("../../assets/pencil.png");

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

  // Logout function
  function logout() {
    UserCollection.logout()
      .then(() => showToast("success", "Logout completed!", "See you soon!"))
      .catch(error1 => showToast("error", "Error", error1.message));
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const setUsern = async () => {
      await setUserData(await getUserData());
      await setUser(await currentUser());
    };
    setUsern();
  }, [dummyUser]);

  useEffect(() => {
    const setUsern = async () => {
      await setUserData(await getUserData());
    };
    setUsern();
    return UserCollection.onAuthStateChange(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  function changeProfileLogo() {
    setShowModal(true);
  }

  function changeUsername(username) {
    setUsernameFirebase(username).done(() => setDummyUser(Math.random));
  }

  function changeDescription(description) {
    setDescriptionFirebase(description).done(() => setDummyUser(Math.random));
  }

  if (initializing) {
    return null;
  }

  if (user != null) {
    return (
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <VStack justifyContent={"space-between"} alignContent={"stretch"}
                    style={{ padding: "3%", alignSelf: "center", backgroundColor: "white", margin: "3%" }}>
              <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}>
                <Avatar animate badgeProps={{
                  onPress() {
                    changeProfileLogo();
                  }, size: 26, icon: pencil, backgroundColor: "white", borderWidth: 1, borderRadius: 20,
                }} badgePosition={"BOTTOM_RIGHT"} size={100}
                        source={user.photoURL !== null ? { uri: user.photoURL } : null} />
                <VStack style={{ padding: 20, width: "60%" }}>

                  <View>
                    {edit ?
                      // Edit username
                      <TextInput placeholder={userData.first_name + " " + userData.last_name}
                                 value={userData.first_name + " " + userData.last_name}
                                 placeholderTextColor={"grey"} style={{
                        color: "black",
                        backgroundColor: 'yellow'
                      }} onPress={changeUsername} /> :
                      // Show username
                      <Text style={styles.title}>{userData.first_name + " " + userData.last_name}</Text>
                    }
                    <Text style={styles.text}>{user.email}</Text>
                    {edit ?
                      // No existing username, add it!
                      <TextInput placeholder={userData.username !== undefined ? "@" + userData.username : "Set an @username"}
                                 autoCapitalize={"none"}
                                 value={userData.username}
                                 placeholderTextColor={"grey"} style={{
                        color: "black",
                        backgroundColor: 'yellow',
                      }} onPress={changeUsername} /> :

                      // Show username if edit is not active (or ask to choose a new one if not exists)
                      (userData.username !== undefined ? <Text style={{ color: "grey" }}>@{userData.username}</Text> :
                        <TextInput placeholder={"Click to set @username"}
                                   onSubmitEditing={(data) => changeUsername(data.nativeEvent.text)}
                                   autoCapitalize={"none"}
                                   placeholderTextColor={"grey"} style={{
                          color: "grey",
                        }} onPress={changeUsername} />)}
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

              {/* Description, bio */}
              <VStack>
                <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}>
                  <Text style={styles.title}>About me</Text>
                  {edit ?
                    <Icon name={"content-save-outline"} color={"green"} size={30} onPress={() => setEdit(!edit)} /> :
                    <Icon name={"square-edit-outline"} color={"black"} size={30} onPress={() => setEdit(!edit)} />}

                </HStack>
                {userData.description ? <Text style={styles.text}>{userData.description}</Text> :
                  <TextInput placeholder={"Click to set a description.."}
                             onSubmitEditing={(data) => changeDescription(data.nativeEvent.text)}
                             placeholderTextColor={"grey"} style={{
                    color: "grey",
                    fontSize: 15,
                  }} onPress={changeDescription} />}
              </VStack>

              {/* Badges*/}
              <VStack>
                <HStack alignItems={"center"} justifyContent={"space-between"} alignContent={"stretch"}>
                  <Text style={styles.title}>My Badges</Text>
                </HStack>
                {badges()}
              </VStack>
            </VStack>

            <View style={styles.boxButton}>
              <Button onPress={logout}>Logout</Button>
            </View>
            <ModalPhoto typeOfUpload="profile_photo" show={showModal} updateUser={(response) => setDummyUser(response)}
                        updateShow={(response) => setShowModal(response)} modalResponse />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
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

