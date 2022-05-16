import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

// Retrieves ALL the trips on the server
export async function getAll() {
  let trips = [];
  //First call in order to retrieve all the info needed about the trips
  const tripsData = (await firestore().collection("Trip").get()).docs;

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

export async function setLike(tripID) {
  await firestore().collection('Trip').doc(tripID).set({likes: FieldValue.arrayUnion(currentUser().uid)}, {merge: true})

}

export async function removeLike(tripID) {
  await firestore().collection('Trip').doc(tripID).update({likes: FieldValue.arrayRemove(currentUser().uid)})

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

// Add new Trip
export async function newTrip(form) {
  const tripData = {
    trip_title: form.title,
    location: form.location,
    description: form.description,
  };

  firestore()
    .collection('Trip')
    .add(tripData)
    .then(() => {
      console.log('Trip added!');
    });
}
