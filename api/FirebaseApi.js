// All the code needed to call firebase MUST be in here!

import firebase from '@react-native-firebase/app';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import storage from '@react-native-firebase/storage';


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

  static async emailLogin(userData) {
    await auth().signInWithEmailAndPassword(userData.email, userData.password);
  }

  static async logout(){
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

  static async changeProfileImage(user, image) {
    const imagePath = user.uid + '/profile_image';
    const reference = storage().ref(imagePath);
    console.log( await reference.getDownloadURL())
    await reference.putFile(image.assets[0].uri)
      .then(auth().currentUser.updateProfile({ photoURL: await reference.getDownloadURL()}))
  }


}
