import * as React from "react";
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { HStack, Text, VStack } from "native-base";
import { Avatar } from "react-native-ui-lib";
import { Button } from "@ui-kitten/components";
import {
  currentUser,
  getUserData,
  logout,
  setDescriptionFirebase,
  setUsernameFirebase,
  updateUserInfo,
  UserCollection,
} from "../api/FirebaseApi";
import { showToast } from "../utils/Utils";
import ModalPhoto from "../utils/ModalPhoto";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProfilePage(props) {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState("");
  const [dummyUser, setDummyUser] = useState();
  const [dummyRestoreData, setDummyRestoreData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newFirstName, setNewFirstName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [newUsername, setNewUsername] = useState();
  const [newDescription, setNewDescription] = useState();


  const pencil = require("../../assets/pencil.png");

  // Set into the NEW variables the original values
  useEffect(() => {
    setNewFirstName(userData.first_name)
    setNewLastName(userData.last_name)
    setNewUsername(userData.username)
    setNewDescription(userData.description)
  }, [userData, dummyRestoreData]);

  useEffect(() => {
    const updateUserData = async () => {
      await setUserData(await getUserData());
      await setUser(await currentUser());
    };
    updateUserData();
  }, [dummyUser, props.update]);

  useEffect(() => {
    const updateUserData = async () => {
      await setUserData(await getUserData());
    };
    updateUserData();
    return UserCollection.onAuthStateChange(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  function editingName() {
    return (
      <VStack>
        <TextInput placeholder={userData.first_name}
                   defaultValue={newFirstName}
                   placeholderTextColor={"grey"}
                   onChange={(text) => setNewFirstName(text.nativeEvent.text)}
                   style={{
                     color: "black",
                     backgroundColor: "yellow",
                   }}
        />
        <TextInput placeholder={userData.last_name}
                   defaultValue={newLastName}
                   placeholderTextColor={"grey"}
                   onChange={(text) => setNewLastName(text.nativeEvent.text)}
                   style={{
                     color: "black",
                     backgroundColor: "yellow",
                   }}
        />
      </VStack>);
  }

  function iconOnEditing() {
    return(
      <HStack marginLeft={-50}>
        <Icon name={"restore"} color={"red"} size={40} onPress={() => {setEdit(!edit); setDummyRestoreData(Math.random)}} />
        <Icon name={"check"} color={"green"} size={40} onPress={() => confirmEdit()} />
      </HStack>
    )
  }

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

  async function confirmEdit() {
    if (newFirstName !== userData.first_name || newLastName !== userData.last_name || newUsername !== userData.username || newDescription !== userData.description) {
      setDummyUser(await updateUserInfo(newFirstName, newLastName, newUsername, newDescription))
    }
    setEdit(!edit)
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
  function Logout() {
    logout()
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
      <ScrollView keyboardShouldPersistTaps={"handled"}>
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
                      // Edit name
                      editingName()
                      :
                      // Show name
                      <Text style={styles.title}>{userData.first_name + " " + userData.last_name}</Text>
                    }

                    {/* Show e-mail*/}
                    <Text style={styles.text}>{user.email}</Text>
                    {edit ?
                      // Edit username
                      <TextInput
                        placeholder={newUsername !== "" ? "@" + userData.username : "Set an @username"}
                        autoCapitalize={"none"}
                        defaultValue={newUsername}
                        placeholderTextColor={"grey"}
                        onChange={(text) => setNewUsername(text.nativeEvent.text)}
                        style={{
                          color: "black",
                          backgroundColor: "yellow",
                        }} /> :

                      // Show username if edit is not active (or ask to choose a new one if not exists)
                      (userData.username !== "" ? <Text style={{ color: "grey" }}>@{userData.username}</Text> :
                        <TextInput placeholder={"Click to set @username"}
                                   onSubmitEditing={(data) => changeUsername(data.nativeEvent.text)}
                                   autoCapitalize={"none"}
                                   placeholderTextColor={"grey"}
                                   style={{
                                     color: "grey",
                                   }}
                                   onPress={changeUsername} />)}
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


                  {// Edit button
                    edit ?
                      iconOnEditing() :
                      <Icon name={"square-edit-outline"} color={"black"} size={30} onPress={() => setEdit(!edit)} />
                  }

                </HStack>

                { // User description
                  // Edit description
                  edit ? <TextInput multiline
                                    defaultValue={newDescription}
                                    onChange={(text) => setNewDescription(text.nativeEvent.text)}
                                    placeholder={userData.description !== undefined ? userData.description : "Set a description.."}
                                    placeholderTextColor={"grey"} style={{
                      color: "black",
                      fontSize: 15,
                      backgroundColor: "yellow",
                    }} /> :
                    // Ask user to add description if it not exists
                    (userData.description ? <Text style={styles.text}>{userData.description}</Text> :
                      // Show description
                      <TextInput placeholder={"Click to set a description.."}
                                 onSubmitEditing={(data) => changeDescription(data.nativeEvent.text)}
                                 placeholderTextColor={"grey"} style={{
                        color: "grey",
                        fontSize: 15,
                      }} onPress={changeDescription} />)}
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
              <Button onPress={Logout}>Logout</Button>
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

