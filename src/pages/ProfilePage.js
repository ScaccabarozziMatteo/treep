import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {HStack, Text, VStack} from 'native-base';
import {Avatar} from 'react-native-ui-lib';
import {Button} from '@ui-kitten/components';
import {
  currentUser,
  getUserData,
  logout,
  onAuthStateChange,
  setBioFirebase,
  setUsernameFirebase,
  updateUserInfo,
} from '../api/UserApi';
import {showToast} from '../utils/Utils';
import ModalPhoto from '../utils/ModalPhoto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfilePage(props) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState('');
  const [dummyUser, setDummyUser] = useState();
  const [dummyRestoreData, setDummyRestoreData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newFirstName, setNewFirstName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [newUsername, setNewUsername] = useState();
  const [newBio, setNewBio] = useState();

  const pencil = require('../../assets/pencil.png');

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
      const user = await currentUser();
      const userData = await getUserData();
      setUserData(userData);
      setUser(user);
    };
    updateUserData();
  }, [dummyUser, props.update]);

  // Initial action when the page is created
  useEffect(() => {
    const updateUserData = async () => {
      const userData = await getUserData();
      setUserData(userData);
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
          placeholderTextColor={'grey'}
          onChange={text => setNewFirstName(text.nativeEvent.text)}
          style={{
            color: 'black',
            backgroundColor: 'yellow',
          }}
        />
        <TextInput
          placeholder={userData.last_name}
          defaultValue={newLastName}
          placeholderTextColor={'grey'}
          onChange={text => setNewLastName(text.nativeEvent.text)}
          style={{
            color: 'black',
            backgroundColor: 'yellow',
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
          name={'restore'}
          color={'red'}
          size={40}
          onPress={() => {
            setEdit(!edit);
            setDummyRestoreData(Math.random);
          }}
        />
        <Icon
          name={'check'}
          color={'green'}
          size={40}
          onPress={() => confirmEdit()}
        />
      </HStack>
    );
  }

  // Return the user badges
  function badges() {
    return (
      <VStack alignItems={'center'}>
        <HStack
          justifyContent={'space-between'}
          alignContent={'stretch'}
          width={'80'}>
          <Icon name={'earth'} color={isActiveBadge(0)} size={40} />
          <Icon name={'airplane-takeoff'} color={isActiveBadge(1)} size={40} />
          <Icon
            name={'comment-text-outline'}
            color={isActiveBadge(2)}
            size={40}
          />
          <Icon name={'hand-heart'} color={isActiveBadge(3)} size={40} />
          <Icon
            name={'professional-hexagon'}
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
    if (userData !== '') {
      if (userData.badges[number]) {
        return 'green';
      } else {
        return 'grey';
      }
    } else {
      return 'grey';
    }
  }

  // Logout function
  function Logout() {
    logout()
      .then(() => showToast('success', 'Logout completed!', 'See you soon!'))
      .catch(error1 => showToast('error', 'Error', error1.message));
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

  if (user != null) {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <VStack
              justifyContent={'space-between'}
              alignContent={'stretch'}
              style={{
                padding: '3%',
                alignSelf: 'center',
                backgroundColor: 'white',
                margin: '3%',
              }}>
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                alignContent={'stretch'}>
                <Avatar
                  animate
                  badgeProps={{
                    onPress() {
                      changeProfileLogo();
                    },
                    size: 26,
                    icon: pencil,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderRadius: 20,
                  }}
                  badgePosition={'BOTTOM_RIGHT'}
                  size={100}
                  source={user.photoURL !== null ? {uri: user.photoURL} : null}
                />
                <VStack style={{padding: 20, width: '60%'}}>
                  <View>
                    {edit ? (
                      // Edit name
                      editingName()
                    ) : (
                      // Show name
                      <Text style={styles.title}>
                        {userData.first_name + ' ' + userData.last_name}
                      </Text>
                    )}

                    {/* Show e-mail*/}
                    <Text style={styles.text}>{user.email}</Text>
                    {edit ? (
                      // Edit username
                      <TextInput
                        placeholder={
                          newUsername !== ''
                            ? '@' + userData.username
                            : 'Set an @username'
                        }
                        autoCapitalize={'none'}
                        defaultValue={newUsername}
                        placeholderTextColor={'grey'}
                        onChange={text => setNewUsername(text.nativeEvent.text)}
                        style={{
                          color: 'black',
                          backgroundColor: 'yellow',
                        }}
                      />
                    ) : // Show username if edit is not active (or ask to choose a new one if not exists)
                    userData.username !== '' ? (
                      <Text style={{color: 'grey'}}>@{userData.username}</Text>
                    ) : (
                      <TextInput
                        placeholder={'Click to set @username'}
                        onSubmitEditing={data =>
                          changeUsername(data.nativeEvent.text)
                        }
                        autoCapitalize={'none'}
                        placeholderTextColor={'grey'}
                        style={{
                          color: 'grey',
                        }}
                        onPress={changeUsername}
                      />
                    )}
                  </View>
                </VStack>
              </HStack>

              {/* Vanity metrics */}
              <VStack alignItems={'center'}>
                <HStack
                  backgroundColor={'gray.100'}
                  width={'70%'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  alignContent={'stretch'}>
                  <VStack alignItems={'center'}>
                    <Text style={styles.text}>Trips</Text>
                    <Text style={styles.text}>23</Text>
                  </VStack>
                  <VStack alignItems={'center'}>
                    <Text style={styles.text}>Follower</Text>
                    <Text style={styles.text}>100</Text>
                  </VStack>
                  <VStack alignItems={'center'}>
                    <Text style={{color: 'black', width: '105%'}}>
                      Following
                    </Text>
                    <Text style={styles.text}>140</Text>
                  </VStack>
                </HStack>
              </VStack>

              {/* Bio */}
              <VStack>
                <HStack
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  alignContent={'stretch'}>
                  <Text style={styles.title}>About me</Text>

                  {
                    // Edit button
                    edit ? (
                      iconOnEditing()
                    ) : (
                      <Icon
                        name={'square-edit-outline'}
                        color={'black'}
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
                          : 'Set a description..'
                      }
                      placeholderTextColor={'grey'}
                      style={{
                        color: 'black',
                        fontSize: 15,
                        backgroundColor: 'yellow',
                      }}
                    />
                  ) : // Ask user to add bio if it not exists
                  userData.bio ? (
                    <Text style={styles.text}>{userData.bio}</Text>
                  ) : (
                    // Show bio
                    <TextInput
                      placeholder={'Click to set a description..'}
                      onSubmitEditing={data => changeBio(data.nativeEvent.text)}
                      placeholderTextColor={'grey'}
                      style={{
                        color: 'grey',
                        fontSize: 15,
                      }}
                      onPress={changeBio}
                    />
                  )
                }
              </VStack>

              {/* Badges*/}
              <VStack>
                <HStack
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  alignContent={'stretch'}>
                  <Text style={styles.title}>My Badges</Text>
                </HStack>
                {badges()}
              </VStack>
            </VStack>

            <View style={styles.boxButton}>
              <Button onPress={Logout}>Logout</Button>
            </View>
            <ModalPhoto
              typeOfUpload="profile_photo"
              show={showModal}
              updateUser={response => setDummyUser(response)}
              updateShow={response => setShowModal(response)}
              modalResponse
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // row
    alignItems: 'center',
  },
  boxButton: {
    paddingTop: 20,
    width: '40%',
    alignSelf: 'center',
  },
  input: {
    color: 'black',
    width: '80%',
    alignSelf: 'center',
  },
  text: {
    color: 'black',
  },
  title: {
    color: 'black',
    fontWeight: '700',
    width: '90%',
    marginTop: 30,
  },
});