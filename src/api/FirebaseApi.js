// All the code needed to call firebase MUST be in here!

import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import storage from "@react-native-firebase/storage";
import { showToast } from "../utils/Utils";
import ProfilePage from "../pages/ProfilePage";
import React from 'react';
import { err } from "react-native-svg/lib/typescript/xml";


export class TripCollection {

  // Retrieves ALL the trips on the server
  static getAll = async () => {
    let trips = [];
    const tripsData = (await firestore().collection("Trip").get()).docs;

    tripsData.forEach((trip) => {
      trips.push(trip._data);
    });

    //console.log(trips);
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
  const imagePath = user.uid + '/profile_image';
  const reference = storage().ref(imagePath);
  await reference.putFile(image.assets[0].uri)
    .then().done(async () => {
      await auth().currentUser.updateProfile({ photoURL: await reference.getDownloadURL() });
      showToast('success', 'Upload', 'Image uploaded!'); props.updateUser(Math.random())
    })
}

export function emailRegistration(userData, navigation) {
  auth().createUserWithEmailAndPassword(userData.email, userData.password).then(async () => {
    await setName(userData.name);
    await auth().signOut()
    await UserCollection.emailLogin(userData)
    await navigation.pop()
  }).catch(error => showToast("error", "Registration", error.message));
}

function setName(name) {
  auth().currentUser.updateProfile({ displayName: name }).then(async () => {
    showToast("success", "Registration", "User created! :D");
  }).catch(error => showToast("error", "Registration", error.message));

}

export async function setUsernameFirebase(user) {
  const data = {
    username: user,
  };

// Add a new document in collection "users" with UID
  const res = await firestore().collection('users').doc(currentUser().uid).set(data);
}

export async function getUsername() {
  const doc = await firestore().collection('users').doc(currentUser().uid).get()
  if (doc.data() !== undefined)
    return doc.data().username
  else
    return ''
}

export function currentUser() {
  return auth().currentUser;
}
