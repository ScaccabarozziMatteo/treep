import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {currentUser} from './UserApi';
import firebase from '@react-native-firebase/app';

const FieldValue = firebase.firestore.FieldValue;

// Retrieves ALL the trips on the server
export async function getAll() {
  let trips = [];

  //First call in order to retrieve all the info needed about the trips

  const tripsData = (await firestore().collection('Trip').limit(3).get()).docs;

  //For each trip, we also need to get the relative info about its user
  for (const t of tripsData) {
    //Calls firebase to get the user data
    const postID = t._ref._documentPath._parts[1];
    const isLiked = t.data().likes.includes(currentUser().uid);
    const userData = await firestore()
      .collection('users/' + t.data().userID + '/public_info')
      .doc('personal_data')
      .get();
    //Merges together the info about the trip and the info about the user
    let mergedObj = {...t.data(), ...userData.data()};
    //Add postID
    mergedObj = {...mergedObj, postID};
    //Add isLiked
    mergedObj = {...mergedObj, isLiked};
    //Pushes the retrieved info into an array
    trips.push(mergedObj);
  }
  return trips;
}

//Gets all the trips of a specified user
export async function getUserTrips(userId) {
  let trips = [];
  const tripsData = (
    await firestore().collection('Trip').where('userID', '==', userId).get()
  ).docs;
  for (const t of tripsData) {
    trips.push(t.data());
  }
  return trips;
}

// Gets the cover photo of a given trip
export async function getCoverPhoto(tripId) {
  const imagePath = tripId.coverPhoto;
  const reference = storage().ref(imagePath);
  return await reference.getDownloadURL();
}

export async function setLike(tripID) {
  await firestore()
    .collection('Trip')
    .doc(tripID)
    .set({likes: FieldValue.arrayUnion(currentUser().uid)}, {merge: true});
}

export async function removeLike(tripID) {
  await firestore()
    .collection('Trip')
    .doc(tripID)
    .update({likes: FieldValue.arrayRemove(currentUser().uid)});
}

export async function setWish(tripID) {
  await firestore()
    .collection('Trip')
    .doc(tripID)
    .set({wishes: FieldValue.arrayUnion(currentUser().uid)}, {merge: true});
}

export async function removeWish(tripID) {
  await firestore()
    .collection('Trip')
    .doc(tripID)
    .update({wishes: FieldValue.arrayRemove(currentUser().uid)});
}

// Add new Trip
export async function newTrip(form) {
  const tripData = {
    title: form.title,
    description: form.description,
    startDate: form.startDate,
    endDate: form.endDate,
    userID: currentUser().uid,
  };

  firestore()
    .collection('Trip')
    .add(tripData)
    .then(() => {
      console.log('Trip added!');
    });
}
