import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { currentUser } from "./UserApi";
import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import { showToast } from "../utils/Utils";

const FieldValue = firebase.firestore.FieldValue;

// Retrieves ALL the trips on the server
export async function getAll () {
  let trips = [];

  //First call in order to retrieve all the info needed about the trips

  const tripsData = (await firestore().collection("Trip").limit(3).get()).docs;


  //For each trip, we also need to get the relative info about its user
  for (const t of tripsData) {
    //Calls firebase to get the user data
    const postID = t._ref._documentPath._parts[1];
    const isLiked = (t.data().likes).includes(currentUser().uid)
    const isWished = (t.data().wishes).includes(currentUser().uid)
    const userData = await firestore().collection("users/" + t.data().userID + "/public_info").doc("personal_data").get();
    //Merges together the info about the trip and the info about the user
    let mergedObj = {...t.data(), ...userData.data()};
    //Add postID
    mergedObj = {...mergedObj, postID}
    //Add isLiked and Wishes
    mergedObj = {...mergedObj, isLiked}
    mergedObj = {...mergedObj, isWished}
    //Pushes the retrieved info into an array
    trips.push(mergedObj);
  }
  return trips;
}

//Gets all the trips of a specified user
export async function getUserTrips (userId) {
  let trips = [];
  const tripsData = (await firestore().collection("Trip").where("userID", "==", userId).get()).docs;
  for (const t of tripsData){
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
  await firestore().collection('Trip').doc(tripID).set({likes: FieldValue.arrayUnion(currentUser().uid)}, {merge: true})
}

export async function removeLike(tripID) {
  await firestore().collection('Trip').doc(tripID).update({likes: FieldValue.arrayRemove(currentUser().uid)})
}

export async function  setWish(tripID) {
  await firestore().collection('Trip').doc(tripID).set({wishes: FieldValue.arrayUnion(currentUser().uid)}, {merge: true})
}

export async function removeWish(tripID) {
  await firestore().collection('Trip').doc(tripID).update({wishes: FieldValue.arrayRemove(currentUser().uid)})
}


// Add new Trip
export async function newTrip(form, places, activities, coverPhoto) {

  const tripData = {
    title: form.title,
    description: form.description,
    startDate: form.startDate,
    endDate: form.endDate,
    userID: currentUser().uid,
    addedDate: new Date(),
    status: false,
    wishes: [],
    location: places,
    activities: activities
  }


  firestore()
    .collection('trip')
    .add(tripData)
    .then(async function(ref) {
      const imagePath = 'trips/' + ref.id + "/cover_photo";
      const reference = storage().ref(imagePath);
      await reference.putFile(coverPhoto.assets[0].uri)
      const url = await reference.getDownloadURL();

      const data = {
        coverPhoto: url
      }
      console.log(ref.id)

      await firestore().collection('trip').doc(ref.id).set(data, {merge: true})

      showToast('success', 'Success', 'Trip added! :)')

    });
}

// this does not connect, think it should be close to the right solution
// link to documentation https://rnfirebase.io/firestore/usage
export async function setActivities(form) {
  const activity = {
    date: form.date,
    activity_title: form.activity_title,
    description: form.description,
    link: form.link,
  };

  await firestore()
    .collection('Trip/' + '/activities')
    .add(activity)
    .then(() => {
      console.log('Activity added!');
    });
}
export async function getTripById (id) {
  const tripData = await firestore().collection('Trip').doc(id).get();

  const isLiked = (tripData.data().likes).includes(currentUser().uid)
  const isWished = (tripData.data().wishes).includes(currentUser().uid)

  let mergedObj = {...tripData.data(), isLiked};
  mergedObj = {...mergedObj, isWished};

  return mergedObj;
}

