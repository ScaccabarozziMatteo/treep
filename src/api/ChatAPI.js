import firestore from "@react-native-firebase/firestore";
import { firebase } from "@react-native-firebase/database";
import { currentUser } from "./UserApi";


export async function retrieveAllChats() {
  const chats = (await firestore().collection("users/" + currentUser().uid + "/chats").get()).docs;

  if (chats[0] !== undefined) {
    let chatArray = []
    for (const chat of chats) {
      const userData = await firestore().collection("users/" + chat.data().userID + "/public_info").doc("personal_data").get();
      let mergedObj = {...chat.data(), ...userData.data()};
      let lastMessage = await retrieveLastMessageChat(chat.data().chatID)
      lastMessage = Object.values(lastMessage.val())
      mergedObj = {...mergedObj, lastMessage}
      chatArray.push(mergedObj)
    }
    chatArray.sort(function(a, b) {
      return new Date(b.lastMessage[0].timestamp) - new Date(a.lastMessage[0].timestamp);
    })

    return chatArray;
  }
  else {
    return 0
  }
}

export async function retrieveSpecificChat(friendID) {
  const doc = await firestore().collection("users/" + currentUser().uid + "/chats").doc(friendID).get();
  if (doc.data() !== undefined)
    return doc.data().chatID;
  else
    return 0;
}

export async function retrieveLastMessageChat(chatID) {
  const DB = firebase.app().database('https://treep-mdp-default-rtdb.europe-west1.firebasedatabase.app/')

  return await DB.ref('/chats/' + chatID).limitToLast(1).once('value')
}

export async function setChatsFirestore(friendID, chatID) {
  const data = {
    chatID: chatID,
    userID: friendID
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

