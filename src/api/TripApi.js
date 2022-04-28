import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {showToast} from '../utils/Utils';

// Retrieves ALL the trips on the server
export async function getAll() {
  let trips = [];
  //First call in order to retrieve all the info needed about the trips
  const tripsData = (await firestore().collection('Trip').get()).docs;

  //For each trip, we also need to get the relative info about its user
  for (const t of tripsData) {
    //Calls firebase to get the user data
    const userData = await firestore()
      .collection('users/' + t.data().userID + '/public_info')
      .doc('personal_data')
      .get();
    //Merges together the info about the trip and the info about the user
    const mergedObj = {...t.data(), ...userData.data()};
    //Pushes the retrieved info into an array
    trips.push(mergedObj);
  }
  return trips;
}

//Gets all the trips of a specified user
export async function getUserTrips(userId) {
  const data = await firestore()
    .collection('Trip')
    .where('userID', '==', userId)
    .get();
  if (data.empty) {
    return '';
  } else {
    return data._docs;
  }
}

// Gets the cover photo of a given trip
export async function getCoverPhoto(tripId) {
  const imagePath = tripId.coverPhoto;
  const reference = storage().ref(imagePath);
  return await reference.getDownloadURL();
}

//Changes the profile image of the current user
export async function changeCoverImage(tripId) {
  let url;
  const imagePath = tripId.coverPhoto;
  const reference = storage().ref(imagePath);
  await reference.getDownloadURL(), (url = await reference.getDownloadURL());
  await firestore().collection('Trip').doc('trip_data').update({photoURL: url});
  await showToast('success', 'Upload', 'Cover photo uploaded!');
}
