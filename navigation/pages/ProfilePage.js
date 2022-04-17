import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Stack } from "native-base";
import { Button } from "react-native-elements";
import { Avatar } from "react-native-ui-lib";
import { currentUser, UserCollection } from "../../api/FirebaseApi";
import { showToast } from "../../utils/Utils";
import { useEffect, useState } from "react";
import ModalPhoto from "../../utils/ModalPhoto";
import LoginPage from "./LoginPage";

export default function ProfilePage(props) {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
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
    console.log(user)
    return UserCollection.onAuthStateChange(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  function changeProfileLogo() {
    setShowModal(true);
  }

  if (user != null) {
    return (
      <View>
        <Text style={styles.text}>Welcome {user.email}</Text>
        <Stack direction={"row"}>
          <Avatar animate={true} badgeProps={{
            onPress() {
              changeProfileLogo();
            }, size: 26, icon: pencil, backgroundColor: "white", borderWidth: 1, borderRadius: 20,
          }} badgePosition={"BOTTOM_RIGHT"} size={100}
                  source={user.photoURL !== null ? { uri: user.photoURL } : null} />
          <Text style={{ color: "black", padding: 40 }}>{user.displayName}</Text>
        </Stack>

        <View style={styles.boxButton}>
          <Button title={"Logout"} onPress={logout} />
        </View>
        <ModalPhoto typeOfUpload='profile_photo' show={showModal} updateUser={ (response) => { onAuthStateChanged(currentUser()); }} updateShow={(response) => setShowModal(response)} modalResponse />
      </View>
    );
  }
  else {
    return(<LoginPage/>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // row
    alignItems: "center",
    backgroundColor: "grey",
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
    textAlign: "center",
  },
});

