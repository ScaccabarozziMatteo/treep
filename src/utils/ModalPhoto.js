import Modal from "react-native-modal";
import { Stack, View } from "native-base";
import { Text } from "@rneui/base";
import { Button } from "react-native-elements";
import React from "react";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { showToast } from "./Utils";
import { PermissionsAndroid, Platform, StyleSheet } from "react-native";
import { changeProfileImage, currentUser, UserCollection } from "../api/FirebaseApi";

export default function ModalPhoto(props) {

  let options = {
    title: "Select Image",
    customButtons: [
      {
        name: "customOptionKey",
        title: "Choose Photo from Custom Option",
      },
    ],
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };

  async function openGallery() {

    props.updateShow(false);

    launchImageLibrary(options, async (response) => {

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log(response.error);
      } else if (response.customButton) {
        console.log(
          "User tapped custom button: ",
          response.customButton,
        );
        alert(response.customButton);
      } else {
        switch (props.typeOfUpload) {
          case ("profile_photo"):
            changeProfilePhoto(response);
            break;
        }
      }
    });
  }

  async function openCamera() {

    props.updateShow(false);

    if (Platform.OS === "android") {
      const request = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      switch (request) {
        case PermissionsAndroid.RESULTS.DENIED:
          showToast("error", "Camera permission", "Permission denied");
          break;
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          showToast("error", "Camera permission", "Permission blocked, please enable it in the device settings");
          break;
        case PermissionsAndroid.RESULTS.GRANTED:

          launchCamera(options, (response) => {

            if (response.errorCode) {
              showToast("error", "Camera error", response.errorCode);
            } else if (response.didCancel) {}
              else {
              switch (props.typeOfUpload) {
                case ("profile_photo"):
                  changeProfilePhoto(response);
                  break;

              }
            }

          });
          break
        default:
          showToast("error", "Camera permission", "Generic error, camera should be not available");
          break;
      }
    }
  }

  async function changeProfilePhoto(response) {
    await changeProfileImage(response, props);
  }

  return (
    <Modal isVisible={props.show} onBackdropPress={() => props.updateShow(false)}>
      <View style={{
        width: "110%",
        minHeight: 150,
        alignItems: "center",
        height: "25%",
        marginBottom: "-5%",
        marginLeft: "-5%",
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
      }}>
        <Text style={styles.text}>Choose how to get the picture:</Text>
        <Stack direction={"row"}>
          <Button title={"Take from camera"} onPress={openCamera} />
          <Button title={"Take from gallery"} onPress={openGallery} />
        </Stack>
      </View>
    </Modal>

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
  checkbox: {
    backgroundColor: "red",
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
