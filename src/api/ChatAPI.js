import firestore from "@react-native-firebase/firestore";
import { firebase } from '@react-native-firebase/database';
import { currentUser } from "./UserApi";


export async function retrieveAllChats() {
  const doc = await firestore().collection("users/" + currentUser().uid + "/chats").get();
  if (doc[0].data() !== undefined)
    return doc;
  else
    return 0;
}

export async function retrieveSpecificChat(friendID) {
  const doc = await firestore().collection("users/" + currentUser().uid + "/chats").doc(friendID).get();
  if (doc.data() !== undefined)
    return doc.data().chatID;
  else
    return 0;
}

export async function setChatsFirestore(friendID, chatID) {
  const data = {
    chatID: chatID,
  };

  await firestore().collection("users/" + currentUser().uid + "/chats").doc(friendID).set(data, {merge: true})
  await firestore().collection("users/" + friendID + "/chats").doc(currentUser().uid).set(data, {merge: true})

}

export async function sendMessageDB(chatID, message) {
  const DB = firebase.app().database('https://treep-mdp-default-rtdb.europe-west1.firebasedatabase.app/')

  const newReference = DB.ref('/chats/' + chatID).push();

  newReference
    .set({
      userID: currentUser().uid,
      body: message,
      timestamp: new Date().getTime(),
    })
}

