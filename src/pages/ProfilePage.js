import * as React from "react";
import { useEffect, useState } from "react";
import {
  Keyboard,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { HStack, Text, VStack } from "native-base";
import { Avatar, Button } from "react-native-ui-lib";
import {
  currentUser,
  getFollowers,
  getFollowings,
  getUserData,
  logout,
  onAuthStateChange,
  setBioFirebase,
  setUsernameFirebase,
  updateUserInfo,
} from "../api/UserApi";
import { showToast } from "../utils/Utils";
import ModalPhoto from "../utils/ModalPhoto";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

export default function ProfilePage(props) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState("");
  const [followers, setFollowers] = useState("");
  const [followings, setFollowings] = useState("");
  const [dummyUser, setDummyUser] = useState();
  const [dummyRestoreData, setDummyRestoreData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newFirstName, setNewFirstName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [newUsername, setNewUsername] = useState();
  const [newBio, setNewBio] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const pencil = require("../../assets/pencil.png");

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const updateUser = async () => {
        const user1 = await currentUser();
        if (user1 === null) {
          navigation.push("Login");
        } else {
          setUser(user1);
        }
      };
      updateUser();
      return () => {
      };
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    setDummyUser(Math.random);
    setRefreshing(false);
  };

  // Set into the NEW variables the original values
  useEffect(() => {
    setNewFirstName(userData.first_name);
    setNewLastName(userData.last_name);
    setNewUsername(userData.username);
    setNewBio(userData.bio);
  }, [userData, dummyRestoreData]);

  // useEffect triggers when a user info is changed and the dummyUser is used to triggering the useEffect
  useEffect(() => {
    const updateUserData = async () => {
      if (user !== null) {
        const user = await currentUser();
        const userData = await getUserData();
        setUserData(userData);
        setUser(user);
        const followers = await getFollowers(user.uid);
        const followings = await getFollowings(user.uid);
        setFollowers(followers);
        setFollowings(followings);
      }
    };
    updateUserData();
  }, [dummyUser, props.update, user]);

  // Initial action when the page is created
  useEffect(() => {
    const updateUserData = async () => {
      const user = await currentUser();
      if (user !== null) {
        setUser(user);
        const userData = await getUserData();
        const followers = await getFollowers(user.uid);
        const followings = await getFollowings(user.uid);
        setUserData(userData);
        setFollowers(followers);
        setFollowings(followings);
      }
      return onAuthStateChange(onAuthStateChanged); // unsubscribe on unmount
    };
    updateUserData();
  }, []);

  // This function is used to handle the name editing
  function editingName() {
    return (
      <VStack>
        <TextInput
          placeholder={userData.first_name}
          defaultValue={newFirstName}
          placeholderTextColor={"grey"}
          onChange={text => setNewFirstName(text.nativeEvent.text)}
          style={{
            color: "black",
            backgroundColor: "yellow",
            width: 200,
          }}
        />
        <TextInput
          placeholder={userData.last_name}
          defaultValue={newLastName}
          placeholderTextColor={"grey"}
          onChange={text => setNewLastName(text.nativeEvent.text)}
          style={{
            color: "black",
            backgroundColor: "yellow",
          }}
        />
      </VStack>
    );
  }

  // This function returns the edit button (2 different cases)
  function iconOnEditing() {
    return (
      <HStack marginLeft={-50}>
        <Icon
          name={"restore"}
          color={"red"}
          size={40}
          onPress={() => {
            setEdit(!edit);
            setDummyRestoreData(Math.random);
          }}
        />
        <Icon
          name={"check"}
          color={"green"}
          size={40}
          onPress={() => confirmEdit()}
        />
      </HStack>
    );
  }

  // Return the user badges
  function badges() {
    return (
      <VStack alignItems={"center"}>
        <HStack
          justifyContent={"space-between"}
          alignContent={"stretch"}
          width={"80"}>
          <Icon name={"earth"} color={isActiveBadge(0)} size={40} />
          <Icon name={"airplane-takeoff"} color={isActiveBadge(1)} size={40} />
          <Icon
            name={"comment-text-outline"}
            color={isActiveBadge(2)}
            size={40}
          />
          <Icon name={"hand-heart"} color={isActiveBadge(3)} size={40} />
          <Icon
            name={"professional-hexagon"}
            color={isActiveBadge(4)}
            size={40}
          />
        </HStack>
      </VStack>
    );
  }

  // If user does not edit anything, it does not write on DB
  async function confirmEdit() {
    if (
      newFirstName !== userData.first_name ||
      newLastName !== userData.last_name ||
      newUsername !== userData.username ||
      newBio !== userData.bio
    ) {
      setDummyUser(
        await updateUserInfo(newFirstName, newLastName, newUsername, newBio),
      );
    }
    setEdit(!edit);
  }

  function isActiveBadge(number) {
    if (userData !== "") {
      if (userData.badges[number]) {
        return "green";
      } else {
        return "grey";
      }
    } else {
      return "grey";
    }
  }

  // Logout function
  function Logout() {
    setUser(null);
    logout()
      .then(() => showToast("success", "Logout completed!", "See you soon!"))
      .catch(error1 => showToast("error", "Error", error1.message));
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  function changeProfileLogo() {
    setShowModal(true);
  }

  // Call Firebase function and then set the dummy that triggers the useEffect
  function changeUsername(username) {
    setUsernameFirebase(username).done(() => setDummyUser(Math.random));
  }

  // Call Firebase function and then set the dummy that triggers the useEffect
  function changeBio(bio) {
    setBioFirebase(bio).done(() => setDummyUser(Math.random));
  }

  if (initializing) {
    return null;
  }

  if (user !== null) {
    return (
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={"handled"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack>
            <VStack
              justifyContent={"space-between"}
              alignContent={"stretch"}
              style={styles.mainContainer}>
              <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                alignContent={"stretch"}>
                <LinearGradient
                  style={{ borderRadius: 29 }}
                  colors={["#376AED", "#49B0E2", "#9CECFB"]}>
                  <View
                    style={{
                      margin: 1.8,
                      backgroundColor: "white",
                      borderRadius: 28,
                    }}>
                    <Avatar
                      animate
                      backgroundColor={"transparent"}
                      imageStyle={{
                        borderRadius: 22,
                        width: "84%",
                        height: "84%",
                        left: "8%",
                        top: "8%",
                      }}
                      badgeProps={{
                        onPress() {
                          changeProfileLogo();
                        },
                        size: 26,
                        icon: pencil,
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderRadius: 20,
                      }}
                      badgePosition={"BOTTOM_RIGHT"}
                      size={90}
                      source={
                        user.photoURL !== null ? { uri: user.photoURL } : null
                      }
                    />
                  </View>
                </LinearGradient>
                <VStack
                  justifyContent={"space-between"}
                  alignContent={"stretch"}
                  style={{ width: "80%", padding: 20 }}>
                  <View>
                    {
                      /* Show e-mail*/
                      //<Text style={styles.text}>{user.email}</Text>
                    }
                    {edit ? (
                        // Edit username
                        <TextInput
                          placeholder={
                            newUsername !== ""
                              ? "@" + userData.username
                              : "Set an @username"
                          }
                          autoCapitalize={"none"}
                          defaultValue={newUsername}
                          placeholderTextColor={"grey"}
                          onChange={text => setNewUsername(text.nativeEvent.text)}
                          style={{
                            color: "black",
                            backgroundColor: "yellow",
                          }}
                        />
                      ) : // Show username if edit is not active (or ask to choose a new one if not exists)
                      userData.username !== "" ? (
                        <Text style={styles.username}>@{userData.username}</Text>
                      ) : (
                        <TextInput
                          placeholder={"Click to set @username"}
                          onSubmitEditing={data =>
                            changeUsername(data.nativeEvent.text)
                          }
                          autoCapitalize={"none"}
                          placeholderTextColor={"grey"}
                          style={{ color: "grey" }}
                          onPress={changeUsername}
                        />
                      )}
                    {edit ? (
                      // Edit name
                      editingName()
                    ) : (
                      // Show name
                      <Text style={styles.name}>
                        {userData.first_name + " " + userData.last_name}
                      </Text>
                    )}
                    {/* Show user title*/}
                    <Text style={styles.userTitle}>Explorer</Text>
                  </View>
                </VStack>
              </HStack>

              {/* Bio */}
              <VStack>
                <HStack
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  alignContent={"stretch"}>
                  <Text style={styles.aboutMeTitle}>About me</Text>

                  {
                    // Edit button
                    edit ? (
                      iconOnEditing()
                    ) : (
                      <Icon
                        name={"square-edit-outline"}
                        color={"black"}
                        size={30}
                        onPress={() => setEdit(!edit)}
                      />
                    )
                  }
                </HStack>

                {
                  // User bio
                  // Edit bio
                  edit ? (
                      <TextInput
                        multiline
                        defaultValue={newBio}
                        onChange={text => setNewBio(text.nativeEvent.text)}
                        placeholder={
                          userData.bio !== undefined
                            ? userData.bio
                            : "Set a description.."
                        }
                        placeholderTextColor={"grey"}
                        style={{
                          color: "black",
                          fontSize: 15,
                          backgroundColor: "yellow",
                        }}
                      />
                    ) : // Show bio
                    userData.bio ? (
                      <Text style={styles.aboutMeText}>{userData.bio}</Text>
                    ) : (
                      // Ask user to add bio if it not exists
                      <TextInput
                        placeholder={"Click to set a description.."}
                        onSubmitEditing={data => changeBio(data.nativeEvent.text)}
                        placeholderTextColor={"grey"}
                        style={{
                          color: "grey",
                          fontSize: 15,
                        }}
                        onPress={changeBio}
                      />
                    )
                }
              </VStack>

              {/* Vanity metrics */}
              <VStack alignItems={"center"}>
                <HStack
                  backgroundColor={"white"}
                  top={44}
                  borderColor={"black"}
                  borderWidth={0.5}
                  borderRadius={12}
                  width={"80%"}
                  paddingLeft={5}
                  paddingRight={5}
                  paddingBottom={1}
                  paddingTop={1}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  alignContent={"stretch"}>
                  <VStack alignItems={"center"}>
                    <Text style={styles.numberVanity}>23</Text>
                    <Text style={styles.textVanity}>Trips</Text>
                  </VStack>
                  <VStack alignItems={"center"}>
                    <TouchableOpacity onPress={() => navigation.navigate({
                      name: "Follow",
                      params: { title: userData.first_name + "'s followings", userId: currentUser().uid, type: 'followings' },
                    })} style={{alignItems: 'center'}}>
                      <Text style={styles.numberVanity}>{followings.length}</Text>
                      <Text style={styles.textVanity}>Following</Text>
                    </TouchableOpacity>
                  </VStack>
                  <VStack alignItems={"center"}>
                    <TouchableOpacity onPress={() => navigation.navigate({
                      name: "Follow",
                      params: { title: userData.first_name + "'s followers", userId: currentUser().uid, type: 'followers'},
                    })} style={{alignItems: 'center'}}>
                      <Text style={styles.numberVanity}>{followers.length}</Text>
                      <Text style={styles.textVanity}>Followers</Text>
                    </TouchableOpacity>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>

            {/* Badges*/}
            <VStack>
              <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                alignContent={"stretch"}
              />
              {badges()}
            </VStack>

            <View style={styles.boxButton}>
              <Button
                label={"Logout"}
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={Logout}
              />
            </View>
            <ModalPhoto
              typeOfUpload="profile_photo"
              show={showModal}
              updateUser={response => setDummyUser(response)}
              updateShow={response => setShowModal(response)}
              modalResponse
            />
          </VStack>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  } else {
    return <View>{navigation.navigate("Login")}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // row
    alignItems: "center",
  },
  boxButton: {
    paddingTop: 20,
    width: "40%",
    alignSelf: "center",
  },
  input: {
    color: "black",
    width: "80%",
    alignSelf: "center",
  },
  text: {
    color: "black",
  },
  title: {
    color: "black",
    fontWeight: "700",
    width: "90%",
    marginTop: 30,
  },
  scrollView: {
    backgroundColor: "white",
  },
  mainContainer: {
    padding: "5%",
    width: "85%",
    alignSelf: "center",
    backgroundColor: "white",
    margin: "4%",
    shadowColor: "rgba(82, 130, 255, 0.5)",
    elevation: 8,
    borderRadius: 16,
    marginBottom: 50,
  },
  userTitle: {
    color: "#376AED",
    fontFamily: "Barlow",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
  name: {
    color: "#0D253C",
    fontFamily: "Avenir",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 10,
    lineHeight: 25,
  },
  username: {
    color: "#2D4379",
    fontFamily: "Barlow",
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.24,
  },
  aboutMeTitle: {
    color: "#0D253C",
    fontFamily: "Barlow",
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 19,
  },
  aboutMeText: {
    color: "#2D4379",
    fontFamily: "Barlow",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  numberVanity: {
    color: "black",
    fontFamily: "Barlow",
    lineHeight: 22,
    fontSize: 20,
  },
  textVanity: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Barlow",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#386BED",
    borderColor: "transparent",
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: "Barlow",
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 15,
    paddingRight: 15,
  },
});
