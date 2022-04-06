import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Input, ScrollView, Button, VStack, HStack, Alert, Avatar } from "native-base";
import Toast from 'react-native-toast-message';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserCollection } from "../../api/FirebaseApi";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '890037553856-u31q3091loeoqf2gelsme90vtef5qr24.apps.googleusercontent.com',
  forceConsentPrompt: true,
  offlineAccess: true
})

export default function LoginPage() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [show, setShow] = useState('false');
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const showToast = (type, title, text) => {
    Toast.show({
      type: type,
      position: 'bottom',
      text1: title,
      text2: text
    });
  }

  const handleHideShowPassword = () => setShow(!show);

  // Login using email and password
  function emailLogin(userData) {
    // Wipe variables
      UserCollection.emailLogin(userData)
      .then(r => onAuthStateChanged(r.user))
      .catch(error1 =>  showToast('error', 'Error', error1.message));
  }


  async function GoogleSignIn() {

    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential

    let user = await auth().signInWithCredential(googleCredential);

    showToast('success', 'Great!', 'Welcome back ' + user.additionalUserInfo.profile.given_name + ' :D')

    return user;

  }

  // Logout function
  function logout() {
      UserCollection.logout()
      .then(() => showToast('success', 'Success!', 'Logout correctly executed'))
      .catch(error1 => showToast('error', 'Error', error1.message));
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    return  auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <ScrollView>
        <View>
          <Text style={styles.text}>
            No user has logged in! Please sign in :D
          </Text>
          <Text
            style={{
              color: 'black',
              paddingTop: 30,
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            E-Mail
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={styles.input}
                onBlur={onBlur}
                width="80%"
                alignSelf="center"
                onChangeText={onChange}
                placeholder={'Type your e-mail'}
                placeholderTextColor="grey"
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={{color: 'red', alignSelf: 'center'}}>
              This is required.
            </Text>
          )}

          <Text
            style={{
              color: 'black',
              paddingTop: 30,
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Password
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                width="80%"
                alignSelf="center"
                onBlur={onBlur}
                InputRightElement={
                  <Icon
                    style={{paddingRight: 10}}
                    size={25}
                    color={'black'}
                    name={show ? 'visibility-off' : 'visibility'}
                    onPress={handleHideShowPassword}
                  />
                }
                placeholder={'Password'}
                placeholderTextColor="grey"
                onChangeText={onChange}
                value={value}
                secureTextEntry={!show}
              />
            )}
            name="password"
          />


          {errors.password && (
            <Text style={{color: 'red', alignSelf: 'center'}}>
              This is required.
            </Text>
          )}

          <View style={styles.boxButton}>
            <Button onPress={handleSubmit(emailLogin)}>Login </Button>
          </View>

          <View style={styles.boxButton}>
            <Button onPress={() => GoogleSignIn().catch(error => showToast('error', 'Error', error.message))} >Google </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Else if the user is logged, show they're profile page
  return (
    <View>
      <Text style={styles.text}>Welcome {user.email}</Text>
      <Avatar size={100}></Avatar>
      <View style={styles.boxButton}>
        <Button onPress={logout}>Logout </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // row
    alignItems: 'center',
    backgroundColor: 'grey',
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
    textAlign: 'center',
  },
});
