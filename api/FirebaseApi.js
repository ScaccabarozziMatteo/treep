// All the code needed to call firebase MUST be in here!

import firebase from '@react-native-firebase/app';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import storage from '@react-native-firebase/storage';
import { showToast } from "../utils/Utils";


export class TripCollection {

  // Retrieves ALL the trips on the server
   static getAll = async () => {
    let trips = [];
    const tripsData = (await firestore().collection('Trip').get()).docs;

    tripsData.forEach((trip) => {
      trips.push(trip._data);
    })

    //console.log(trips);
    return (trips);
  }

  // Gets the cover photo of a given trip
  static async getCoverPhoto(trip) {
    const imagePath = trip.coverPhoto;
    const reference = storage().ref(imagePath);
    return await reference.getDownloadURL();
  }
}

export class UserCollection {

  static getCurrentUser() {
    return auth().currentUser;
  }

  static async emailLogin(userData) {
    await auth().signInWithEmailAndPassword(userData.email, userData.password);
  }

  static async logout(){
    await auth().signOut();
    await GoogleSignin.signOut();
  }

  static async signInWithGoogle() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
  }

  static async changeProfileImage(user, image) {
    // Firebase storage path
    const imagePath = user.uid + '/profile_image';
    const reference = storage().ref(imagePath);
    const task = reference.putFile(image.assets[0].uri)
      task.on('state_changed', function(snapshot) {
        showToast('success', 'Progress', 'Uploaded ' + (Math.round(snapshot.bytesTransferred / snapshot.totalBytes)* 100).toString() + ' %')

      });

    // Update user info
    await task.then(auth().currentUser.updateProfile({ photoURL: await reference.getDownloadURL() }))
  }
}
