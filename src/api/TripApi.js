import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { currentUser } from "./UserApi";
import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import { showToast } from "../utils/Utils";

const FieldValue = firebase.firestore.FieldValue;

// Retrieves ALL the trips on the server
export async function getAll() {
  let trips = [];

  //First call in order to retrieve all the info needed about the trips

  const tripsData = (await firestore().collection("trip").limit(5).get()).docs;


  //For each trip, we also need to get the relative info about its user
  for (const trip of tripsData) {
    const t = trip.data();


    let isLiked = false;
    if(t.likes != null) {
      isLiked = (t.likes).includes(currentUser().uid);
    }
    //Retrieves the subregion of the location
    const postID = trip._ref._documentPath._parts[1];
    const name = t.location.name;
    const title = t.title;
    const coverPhoto = t.coverPhoto;


    //Now we have to remove the location object
    const isWished = (t.wishes).includes(currentUser().uid);

    const userData = await firestore().collection("users/" + t.userID + "/public_info").doc("personal_data").get();
    const userPhoto = userData.data().photoURL;
    const userID = userData.data().userID;

    let result = {title};
    result = { ...result, coverPhoto }
    result = { ...result, name };
    //Merges together the info about the trip and the info about the user
    result = { ...result, userPhoto};
    result = { ...result, userID };

    //Add postID
    result = { ...result, postID };
    //Add isLiked and Wishes
    result = { ...result, isLiked };
    result = { ...result, isWished };

    //Pushes the retrieved info into an array
    trips.push(result);

  }
  return trips;
}

//Gets all the trips of a specified user
export async function getUserTrips(userId) {
  let trips = [];
  const tripsData = (await firestore().collection("trip").where("userID", "==", userId).get()).docs;
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
  await firestore().collection("trip").doc(tripID).set({ likes: FieldValue.arrayUnion(currentUser().uid) }, { merge: true });
}

export async function removeLike(tripID) {
  await firestore().collection("trip").doc(tripID).update({ likes: FieldValue.arrayRemove(currentUser().uid) });
}

export async function setWish(tripID) {
  await firestore().collection("trip").doc(tripID).set({ wishes: FieldValue.arrayUnion(currentUser().uid) }, { merge: true });
}

export async function removeWish(tripID) {
  await firestore().collection("trip").doc(tripID).update({ wishes: FieldValue.arrayRemove(currentUser().uid) });
}


// Add new Trip
export async function newTrip(form, places, activities, coverPhoto, navigation) {

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
    activities: activities,
  };


  firestore()
    .collection("trip")
    .add(tripData)
    .then(async function(ref) {
      const imagePath = "trips/" + ref.id + "/cover_photo";
      const reference = storage().ref(imagePath);
      await reference.putFile(coverPhoto.assets[0].uri);
      const url = await reference.getDownloadURL();

      const data = {
        coverPhoto: url,
      };

      await firestore().collection("trip").doc(ref.id).set(data, { merge: true });
      await firestore().collection("users/" + currentUser().uid + "/vanity_metrics").doc("trips").set({ trips: FieldValue.arrayUnion(ref.id) }, { merge: true });
      await firestore().collection("indexes").doc("trips").set({ countries: FieldValue.arrayUnion(places) }, { merge: true });


      navigation.goBack();
      navigation.navigate("TripDetailsPage", ref.id);
      showToast("success", "Success", "Trip added! :)");

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
    .collection("trip/" + "/activities")
    .add(activity)
    .then(() => {
      console.log("Activity added!");
    });
}

export async function getTripById(id) {
  const tripData = await firestore().collection("trip").doc(id).get();
  const t = tripData.data();

  const coverPhoto = t.coverPhoto;
  const title = t.title;
  const region = t.location.region;
  const name = t.location.name;
  const status = t.status;
  const endDate = t.endDate.toDate();
  const startDate = t.startDate.toDate();
  const isLiked = (t.likes).includes(currentUser().uid);
  const isWished = (t.wishes).includes(currentUser().uid);
  const likes = t.likes;
  const wishes = t.wishes;

  let res = {title};
  res = {...res, coverPhoto};
  res = {...res, region};
  res = {...res, name};
  res = {...res, status};
  res = {...res, startDate};
  res = {...res, endDate};
  res = {...res, isLiked};
  res = {...res, isWished};
  res = {...res, likes};
  res = {...res, wishes};


  return res;
}

