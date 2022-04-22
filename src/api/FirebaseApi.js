// All the code needed to call firebase MUST be in here!

import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import storage from "@react-native-firebase/storage";
import { showToast } from "../utils/Utils";
import React from "react";


export class TripCollection {

  // Retrieves ALL the trips on the server
  static getAll = async () => {
    let trips = [];
    const tripsData = (await firestore().collection("Trip").get()).docs;

    tripsData.forEach((trip) => {
      trips.push(trip._data);
    });

    return (trips);
  };

  // Gets the cover photo of a given trip
  static async getCoverPhoto(trip) {
    const imagePath = trip.coverPhoto;
    const reference = storage().ref(imagePath);
    return await reference.getDownloadURL();
  }
}

export class UserCollection {

  static async emailLogin(userData) {
    await auth().signInWithEmailAndPassword(userData.email, userData.password);
  }

  static async logout() {
    await auth().signOut();
    await GoogleSignin.signOut();
  }

  static onAuthStateChange(onAuthStateChanged) {
    return auth().onAuthStateChanged(onAuthStateChanged);
  }

  static async signInWithGoogle() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
  }

}

export async function changeProfileImage(image, props) {
  let user = currentUser();
  let url;
  const imagePath = user.uid + "/profile_image";
  const reference = storage().ref(imagePath);
  await reference.putFile(image.assets[0].uri)
    .then().done(async () => {
      url = await reference.getDownloadURL();
      await auth().currentUser.updateProfile({ photoURL: await reference.getDownloadURL() });
      await firestore().collection("users").doc(currentUser().uid).collection("public_info").doc("personal_data").update({ photoURL: url });
      await showToast("success", "Upload", "Image uploaded!");
      await props.updateUser(Math.random());
    });
}

export function emailRegistration(userData, navigation) {
  auth().createUserWithEmailAndPassword(userData.email, userData.password).then(async () => {
    await UserCollection.emailLogin(userData);
    await setUserInfo(userData);
    await auth().signOut();
    await UserCollection.emailLogin(userData);
    await navigation.pop();
  }).catch(error => showToast("error", "Registration", error.message));
}

async function setUserInfo(data) {

  const userData = {
    first_name: data.first_name,
    last_name: data.last_name,
    sex: data.sex,
    birthdate: data.birthdate,
    badges: [false, false, false, false, false]
  };

  await auth().currentUser.updateProfile({ displayName: data.first_name + " " + data.last_name })
    .then(async () => {
      await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").set(userData)
        .then(
          () => showToast("success", "Registration", "User created! :D"));
    });

}

export async function updateUserInfo(data) {
  await auth().currentUser.updateProfile({ displayName: data.first_name + " " + data.last_name }).then(  async () =>
    await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").update(data))
  return Math.random()
}

export async function setUsernameFirebase(user) {
  const data = {
    username: user.toLowerCase(),
  };

// Add a new document in collection "users" with UID
  const res = await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").update(data);
}

export async function setDescriptionFirebase(user) {
  const data = {
    description: user,
  };

// Add a new document in collection "users" with UID
  const res = await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").update(data);
}

export async function getUsername() {
  const doc = await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").get();

  if (doc.data() !== undefined)
    if (doc.data().username !== undefined)
      return doc.data().username;
    else
      return "";
  else
    return "";
}

export async function getUserData() {
  const doc = await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").get();
  if (doc.data() !== undefined)
    return doc.data();
  else
    return "";
}

export function currentUser() {
  return auth().currentUser;
}

export async function searchUsers(username) {
  const doc = await firestore().collectionGroup("public_info").where("username", "==", username.toLowerCase()).get();
  if (doc.empty)
    return "";
  else
    return doc._docs;
}
