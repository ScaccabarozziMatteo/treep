import * as React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Stack } from "native-base";
import { launchImageLibrary } from "react-native-image-picker";
import { UserCollection } from "../../api/FirebaseApi";
import { showToast } from "../../utils/Utils";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { Icon } from "@rneui/base";

export default function ProfilePage(props) {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(props.user);


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
    return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  function changeProfileImage() {

    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option'
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        showToast('error', 'ImagePicker', response.error)
      } else if (response.customButton) {
        console.log(
          'User tapped custom button: ',
          response.customButton
        );
        alert(response.customButton);
      } else {
        // You can also display the image using data:
        // let source = {
        //   uri: 'data:image/jpeg;base64,' + response.data
        // };

        UserCollection.changeProfileImage(user, response)
          .then(() => {showToast('success', 'Success', 'Profile image updated!'); onAuthStateChanged(UserCollection.getCurrentUser())})
          .catch(error => showToast('error', 'Error', error.message))
      }
    });
  }

  return (
    <View>
      <View>
        <Text style={styles.text}>Welcome {user.email}</Text>
        <Stack direction={'row'}>
          <Avatar size={'xl'} source={{ uri: user.photoURL }} >
            <Avatar.Badge px={2} py={2} m={1} bg={'green.500'} />
          </Avatar>
          <Text style={{color: 'black', padding: 40}}>{user.displayName}</Text>
        </Stack>
        <Stack>
          <Text onPress={changeProfileImage} style={{color: 'black'}}>Change profile image</Text>
        </Stack>
        <View style={styles.boxButton}>
          <Button onPress={logout}>Logout </Button>
        </View>
      </View>
    </View>
  );
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

