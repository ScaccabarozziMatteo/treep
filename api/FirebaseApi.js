// All the code needed to call firebase MUST be in here!

import firebase from '@react-native-firebase/app';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export class TripCollection {
   static async getAll() {
    const trips = await firestore().collection('Trip').get();
    console.log(trips);
    return trips;
  }
}

export class UserCollection {
  static async emailLogin(userData) {
    await auth().signInWithEmailAndPassword(userData.email, userData.password);
  }

}
