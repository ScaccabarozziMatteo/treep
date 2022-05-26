import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { currentUser } from "./UserApi";
import firebase from "@react-native-firebase/app";
import { showToast } from "../utils/Utils";


const FieldValue = firebase.firestore.FieldValue;
const n = 4;

// Retrieves the first trips on the server to be displayed
export async function getFirstPosts() {
  try{
    //First call in order to retrieve all the info needed about the trips
    const tripsData = (await firestore().collection("trip")
      .orderBy('addedDate', 'desc')
      .limit(n)
      .get()).docs;

    let trips = [];
    let lastKey = "";

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

      const userID = t.userID;

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

      lastKey = t.addedDate;
    }
    return {trips, lastKey};

  } catch (e) {
    console.log(e);
  }
}

export async function getNextBatch(key) {

  try{
    //First call in order to retrieve all the info needed about the trips
    const tripsData = (await firestore().collection("trip")
      .orderBy('addedDate', 'desc')
      .startAfter(key)
      .limit(n)
      .get()).docs;

    let trips = [];
    let lastKey = "";

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

      const userID = t.userID;

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
      lastKey = t.addedDate;
    }
    return {trips, lastKey};
  } catch (e) {
    console.log(e);
  }
}

//Gets all the trips of a specified user
export async function getUserTrips(userId) {
  let trips = [];
  const tripsData = (await firestore().collection("trip").where("userID", "==", userId).get()).docs;

  for (const trip of tripsData) {
    const t = trip.data();

    const userData = await firestore().collection("users/" + userId + "/public_info").doc("personal_data").get();
    const userPhoto = userData.data().photoURL;
    const name = t.location.name;

    let res = {t};
    res = {...t, userPhoto};
    res = {...res, name};

    trips.push(res);
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
  await firestore().collection("users/" + currentUser().uid + "/vanity_metrics").doc("wishlist").set({ trips: FieldValue.arrayUnion(tripID) }, { merge: true });
}

export async function removeWish(tripID) {
  await firestore().collection("trip").doc(tripID).update({ wishes: FieldValue.arrayRemove(currentUser().uid) });
  await firestore().collection("users/" + currentUser().uid + "/vanity_metrics").doc("wishlist").update({ trips: FieldValue.arrayRemove(tripID) });

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
    likes: [],
    photos: []
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
      navigation.navigate("TripDetailsPage", {tripId: ref.id});
      showToast("success", "Success", "Trip added! :)");

    });
}

export async function addPhotoToTrip(photo, tripID, navigation) {

  let r = (Math.random() + 1).toString(36).substring(2);

  const imagePath = "trips/" + tripID + "/additional_photos/" + r;
  const reference = storage().ref(imagePath);
  await reference.putFile(photo);
  const url = await reference.getDownloadURL();

  const data = {
      uri: url,
    }

  await firestore().collection("trip").doc(tripID).set({ photos: FieldValue.arrayUnion(data) }, { merge: true }).catch(error => showToast('error', 'Storage error', error.message));

  navigation.navigate("TripDetailsPage", {tripId: tripID, updateTrip: Math.random()});

  showToast('success', 'Photo uploaded!', 'Photo is just been added to your trip! :)')

}


// this does not connect, think it should be close to the right solution
// link to documentation https://rnfirebase.io/firestore/usage
export async function setActivities(tripID, form, navigation) {
  let link;

  if (form.link !== undefined)
    link = form.link
  else
    link = null

  const data =
    {
      activity_title: form.activity_title,
      date: form.date,
      description: form.description,
      link: link,
      registrationDate: new Date(),
    }

  await firestore().collection("trip").doc(tripID).set({activities: FieldValue.arrayUnion(data)}, { merge: true });
  navigation.navigate("TripDetailsPage", {tripId: tripID, updateTrip: Math.random()});
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
  const userID = t.userID;
  const activities = t.activities;
  const photos = t.photos

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
  res = {...res, userID};
  res = {...res, activities}
  res = {...res, photos}

  return res;
}

export async function getTripsFromUserWishList (userId) {
  const tripIds = await firestore().collection("users/" + userId + "/vanity_metrics").doc("wishlist").get();
  let trips = [];
  let ids = tripIds.data().trips;

  for (let i = 0; i < ids.length ; i++){

    const tripData = await firestore().collection("trip").doc(ids[i]).get();
    const t = tripData.data();

    const userData = await firestore().collection("users/" + t.userID + "/public_info").doc("personal_data").get();
    const userPhoto = userData.data().photoURL;
    const name = t.location.name;
    const postID = ids[i];


    let res = {t};
    res = {...t, userPhoto};
    res = {...res, name};
    res = {...res, postID};

    trips.push(res);
  }

  return trips;
}
