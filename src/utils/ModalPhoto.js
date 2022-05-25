/*
  url icons: https://oblador.github.io/react-native-vector-icons/
 */


import Modal from "react-native-modal";
import { Stack, View } from "native-base";
import { Icon, Text } from "@rneui/base";
import React from "react";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { showToast } from "./Utils";
import { PermissionsAndroid, Platform, Pressable, StyleSheet } from "react-native";
import { Image } from 'react-native-compressor';
import { changeProfileImage } from "../api/UserApi";
import { addPhotoToTrip } from "../api/TripApi";
import { useNavigation } from '@react-navigation/native';


export default function ModalPhoto(props) {

  const navigation = useNavigation();

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
      } else if (response.error) {
        showToast("error", "Gallery error", response.errorMessage);
      } else if (response.customButton) {
        showToast("error", "Custom button", "User tapped button: " + response.customButton);
      } else {
        const newImage = await Image.compress(response.assets[0].uri, {compressionMethod: 'auto'})

        switch (props.typeOfUpload) {
          case ("profile_photo"):
            changeProfilePhoto(newImage);
            break;
          case ("newTrip_cover"):
            addNewTripPhoto(newImage);
            break;
          case ("trip_photo"):
            addTripPhoto(newImage, props.tripID, navigation, response.width, response.height);
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

          launchCamera(options, async (response) => {

            if (response.error) {
              showToast("error", "Camera error", response.errorCode);
            } else if (response.didCancel) {
              console.log(response.errorCode)
            } else {
              const newImage = await Image.compress(response.assets[0].uri, {compressionMethod: 'auto'})

              switch (props.typeOfUpload) {
                case ("profile_photo"):
                  changeProfilePhoto(newImage);
                  break;
                case ("newTrip_cover"):
                  addNewTripPhoto(newImage);
                  break;
                case ("trip_photo"):
                  addTripPhoto(newImage, props.tripID, navigation, response.width, response.height);
                  break;
              }
            }

          });
          break;
        default:
          showToast("error", "Camera permission", "Generic error, camera should be not available");
          break;
      }
    }
  }

  async function changeProfilePhoto(response) {
    await changeProfileImage(response, props);
  }

  function addTripPhoto(photo, tripID, navigation, width, height) {
    addPhotoToTrip(photo, tripID, navigation, width, height)
  }

  async function addNewTripPhoto(response) {
    try {
      props.updateImage(response);
    } catch (e) {
      showToast("error", "Error", "Unable to save image");
    }
  }

  return (
    <Modal isVisible={props.show} onBackdropPress={() => props.updateShow(false)}>
      <View style={{
        width: "110%",
        minHeight: 150,
        alignItems: "center",
        height: "23%",
        marginBottom: "-5%",
        marginLeft: "-5%",
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
        <Text h4 style={styles.text}>Choose how to get the picture</Text>
        <Stack direction={"row"} style={{ width: "100%", height: "80%", alignItems: "center" }}>
          <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]} onPress={openCamera}>
            <Stack style={{ alignItems: "center", marginLeft: "35%" }} direction={"column"}>
              <Icon name={"camera-alt"} size={70} color={"grey"} />
              <Text>Camera</Text>
            </Stack>
          </Pressable>
          <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]} onPress={openGallery}>
            <Stack style={{ alignItems: "center", marginRight: "20%", position: "relative" }} direction={"column"}>
              <Icon name={"photo-library"} size={70} color={"grey"} />
              <Text>Gallery</Text>
            </Stack>
          </Pressable>
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
