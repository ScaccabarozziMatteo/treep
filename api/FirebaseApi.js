// All the code needed to call firebase MUST be in here!

import firebase from '@react-native-firebase/app';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export class TripCollection {
   static getAll = async () => {
    let trips = [];
    const tripsData = (await firestore().collection('Trip').get()).docs;

    tripsData.forEach((trip) => {
      trips.push(trip._data);
    })

    //console.log(trips);
    return (trips);
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
}
