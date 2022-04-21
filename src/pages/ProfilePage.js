import * as React from "react";
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Stack } from "native-base";
import { Button } from "react-native-elements";
import { Avatar } from "react-native-ui-lib";
import { currentUser, getUserData, getUsername, setUsernameFirebase, UserCollection } from "../api/FirebaseApi";
import { showToast } from "../utils/Utils";
import { useEffect, useState } from "react";
import ModalPhoto from "../utils/ModalPhoto";

export default function ProfilePage() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState('');
  const [dummyUser, setDummyUser] = useState();
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);

  const pencil = require("../../assets/pencil.png");

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
      await setUserData(await getUserData())
      await setUsername(await getUsername())
      await setUser(await currentUser())

    }
    setUsern()
  }, [dummyUser])

  useEffect(() => {
    const setUsern = async () => {
      await setUsername(await getUsername())
      await setUserData(await getUserData())
    }
    setUsern()
    return UserCollection.onAuthStateChange(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  function changeProfileLogo() {
    setShowModal(true);
  }

  function changeUsername(username) {
    setUsernameFirebase(username).done(() => setUsername(username))
  }

  if (initializing) {
    return null;
  }

  if (user != null) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{padding: '5%', alignSelf: 'center'}}>
          <Stack direction={"row"}>
            <Avatar animate badgeProps={{
              onPress() {
                changeProfileLogo();
              }, size: 26, icon: pencil, backgroundColor: "white", borderWidth: 1, borderRadius: 20,
            }} badgePosition={"BOTTOM_RIGHT"} size={100}
                    source={user.photoURL !== null ? { uri: user.photoURL } : null} />
            <Stack direction={"column"} style={{ padding: 40 }}>

              <View>
                <Text style={{ color: "black" }}>{userData.first_name + ' ' + userData.last_name}</Text>
                <Text style={styles.text}>{user.email}</Text>
                {username !== '' ? <Text style={{ color: "grey" }}>@{username}</Text> :
                  <TextInput placeholder={"Click to set @username"} onSubmitEditing={(data) => changeUsername(data.nativeEvent.text)} autoCapitalize={'none'} placeholderTextColor={'grey'} style={{
                    color: "grey",
                    fontSize: 13,
                  }} onPress={changeUsername} />}
              </View>
            </Stack>
          </Stack>

          <View style={styles.boxButton}>
            <Button title={"Logout"} onPress={logout} />
          </View>
          <ModalPhoto typeOfUpload="profile_photo" show={showModal} updateUser={(response) => setDummyUser(response)}
                      updateShow={(response) => setShowModal(response)} modalResponse />
        </View>
      </TouchableWithoutFeedback>
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
});

