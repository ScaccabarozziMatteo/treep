// All the code needed to call firebase MUST be in here!

import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import storage from "@react-native-firebase/storage";
import { showToast } from "../utils/Utils";
import React from "react";
import { retrieveLastMessageChat } from "./ChatAPI";

const FieldValue = firebase.firestore.FieldValue;

export async function onAuthStateChange(onAuthStateChanged) {
  return auth().onAuthStateChanged(onAuthStateChanged);
}

//Login with email and password
export async function emailLogin(userData) {
  const user = await auth().signInWithEmailAndPassword(userData.email, userData.password).catch(error1 => showToast("error", "Error", error1.message));
  if (user !== undefined)
    return 0;
}

//Logout
export async function logout() {
  await auth().signOut();
  await GoogleSignin.signOut();
}

//Log in with Google
export async function signInWithGoogle() {
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  const user = await auth().signInWithCredential(googleCredential);

  const userData = await getUserData();

  // If it is the first login and the DB has not the document with the user data, return 0 and the LoginPage redirect to the CompleteRegistrationPage
  if (userData === "" || userData.first_name === undefined || userData.last_name === undefined || userData.birthdate === undefined || userData.sex === undefined) {
    return 0;
  } else
    return user;
}

//Changes the profile image of the current user
export async function changeProfileImage(image, props) {
  let user = currentUser();
  let url;
  const imagePath = "users/" + user.uid + "/profile_image";
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

// Register a user using email and password
export function emailRegistration(userData, navigation) {
  auth().createUserWithEmailAndPassword(userData.email, userData.password).then(async () => {
    await emailLogin(userData);
    await setUserInfo(userData);
    await auth().signOut();
    await emailLogin(userData);
    await navigation.pop();
  }).catch(error => showToast("error", "Registration", error.message));
}

async function setUserInfo(data) {

  const userData = {
    first_name: data.first_name,
    last_name: data.last_name,
    sex: data.sex,
    username: "",
    bio: "",
    birthdate: data.birthdate,
    badges: [false, false, false, false, false],
    registrationDate: new Date(),
  };

  await auth().currentUser.updateProfile({ displayName: data.first_name + " " + data.last_name })
    .then(async () => {
      await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").set(userData)
        .then(
          () => showToast("success", "Registration", "User created! :D"));
    });

}

export async function completeProfile(data) {
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  await auth().signInWithCredential(googleCredential);

  const doc = {
    first_name: data.first_name,
    last_name: data.last_name,
    birthdate: data.birthdate,
    sex: data.sex,
    badges: [true, false, true, false, false],
    username: "",
    bio: "",
    registrationDate: new Date(),
  };
  await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").set(doc);
}

export async function updateUserInfo(first_name, last_name, username, bio) {
  const data = {
    first_name: first_name,
    last_name: last_name,
    username: username,
    bio: bio,
  };
  await auth().currentUser.updateProfile({ displayName: data.first_name + " " + data.last_name }).then(async () =>
    await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").update(data));
  return Math.random();
}

export async function setUsernameFirebase(user) {
  const data = {
    username: user.toLowerCase(),
  };

// Add a new document in collection "users" with UID
  await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").update(data);
}

export async function setBioFirebase(user) {
  const data = {
    bio: user,
  };
// Add a new document in collection "users" with UID
  await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").update(data);
}

export async function getUserData() {
  const doc = await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").get();
  if (doc.data() !== undefined)
    return doc.data();
  else
    return "";
}

export async function getUserDataWithID(UID) {
  const doc = await firestore().collection("users/" + UID + "/public_info").doc("personal_data").get();
  if (doc.data() !== undefined)
    return doc.data();
  else
    return "";
}

export function currentUser() {
  return auth().currentUser;
}

export function googleUser() {
  return GoogleSignin.getCurrentUser();
}

export async function searchUsers(username) {
  const doc1 = await firestore().collectionGroup("public_info").where("username", "==", username.toLowerCase()).get();
  const doc2 = await firestore().collectionGroup("public_info").where("first_name", "==", username).get();
  const doc3 = await firestore().collectionGroup("public_info").where("last_name", "==", username).get();

  if (doc1.empty && doc2.empty && doc3.empty)
    return "";
  else {
    let array = [];
    let userArray = [];
    if (!doc1.empty)
      for (const a of doc1._docs) {
        if (currentUser().uid !== a.ref._documentPath._parts[1]) {
          const mergeObj = { ...a.data(), userID: a.ref._documentPath._parts[1] };
          userArray.push(a.ref._documentPath._parts[1]);
          array.push(mergeObj);
        }
      }
    if (!doc2.empty)
      for (const b of doc2._docs) {
        const mergeObj = { ...b.data(), userID: b.ref._documentPath._parts[1] };
        if (!userArray.includes(b.ref._documentPath._parts[1]) && currentUser().uid !== b.ref._documentPath._parts[1]) {
          userArray.push(b.ref._documentPath._parts[1]);
          array.push(mergeObj);
        }
      }
    if (!doc3.empty)
      for (const c of doc3._docs) {
        const mergeObj = { ...c.data(), userID: c.ref._documentPath._parts[1] };
        if (!userArray.includes(c.ref._documentPath._parts[1]) &&  currentUser().uid !== c.ref._documentPath._parts[1]) {
          userArray.push(c.ref._documentPath._parts[1]);
          array.push(mergeObj);
        }
      }
    return array;
  }
}

export async function sharePosition(position) {
  const doc = await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").set(position, { merge: true });

  showToast("success", "Position shared!", "You have shared your position with all users!");
}

export async function deletePosition() {
  const doc = await firestore().collection("users/" + currentUser().uid + "/public_info").doc("personal_data").update({ coords: FieldValue.delete() });

  showToast("success", "Position deleted!", "You have deleted your position shared with all users!");
}

export async function getFollowers(user) {
  const doc = await firestore().collection("users/" + user + "/vanity_metrics").doc("followers").get();
  if (doc.empty || doc.data() === undefined)
    return "";
  else {
    return doc.data().followers;
  }
}

export async function getFollowComplete(user, type) {
  const doc = await firestore().collection("users/" + user + "/vanity_metrics").doc(type).get();
  if (doc.empty || doc.data() === undefined)
    return 0;
  else {

    let followArray = [];
    for (const follow of doc.data()[type]) {
      const userData = await firestore().collection("users/" + follow + "/public_info").doc("personal_data").get();
      const user = { userId: follow };
      let mergedObj = { ...user, ...userData.data() };
      followArray.push(mergedObj);
    }
    return followArray;
  }
}


export async function getFollowings(user) {
  const doc = await firestore().collection("users/" + user + "/vanity_metrics").doc("followings").get();
  if (doc.empty || doc.data() === undefined)
    return "";
  else {
    return doc.data().followings;
  }
}

export async function addFollow(userFollower, userFollowing) {
  await firestore().collection("users/" + userFollower + "/vanity_metrics").doc("followings").set({ followings: FieldValue.arrayUnion(userFollowing) }, { merge: true });
  await firestore().collection("users/" + userFollowing + "/vanity_metrics").doc("followers").set({ followers: FieldValue.arrayUnion(userFollower) }, { merge: true });

  return Math.random();
}

export async function removeFollow(userFollower, userFollowing) {
  await firestore().collection("users/" + userFollower + "/vanity_metrics").doc("followings").update({ followings: FieldValue.arrayRemove(userFollowing) });
  await firestore().collection("users/" + userFollowing + "/vanity_metrics").doc("followers").update({ followers: FieldValue.arrayRemove(userFollower) });

  return Math.random();
}
