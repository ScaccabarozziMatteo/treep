import firestore from "@react-native-firebase/firestore";
import { firebase } from '@react-native-firebase/database';
import { currentUser } from "./UserApi";


export async function retrieveAllChats() {
  const chats = (await firestore().collection("users/" + currentUser().uid + "/chats").get()).docs;
  if (chats[0].data() !== undefined){
    let chatArray = []
    for (const chat of chats) {
      const userData = await firestore().collection("users/" + chat.data().userID + "/public_info").doc("personal_data").get();
      let mergedObj = {...chat.data(), ...userData.data()};
      chatArray.push(mergedObj)
    }
    return chatArray;
  }
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

