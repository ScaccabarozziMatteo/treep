import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, ScrollView, View, BackHandler } from "react-native";
import { Pressable, VStack, HStack } from "native-base";
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { emailLogin, signInWithGoogle, onAuthStateChange } from "../api/UserApi";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { showToast } from "../utils/Utils";
import CompleteRegistrationPage from "./CompleteRegistrationPage";
import { Text } from "@rneui/base";
import { Button } from "react-native-ui-lib";
import { TextInput } from "react-native-paper";

GoogleSignin.configure({
  webClientId: "890037553856-u31q3091loeoqf2gelsme90vtef5qr24.apps.googleusercontent.com",
  forceConsentPrompt: true,
  offlineAccess: true,
});

export default function LoginPage({ navigation, route }) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [show, setShow] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("Explore");
    });
    return () => backHandler.remove();
  }, []);

  const captions = (errors) => {
    return (
      (errors) ? (
        <Text style={{ color: "red", alignSelf: "center" }}>
          {errors.message}
        </Text>
      ) : null
    );
  };

  const handleHideShowPassword = () => setShow(!show);

  // Login using email and password
  async function EmailLogin(userData) {
    const value = await emailLogin(userData).catch(error1 => showToast("error", "Error", error1.message));
    if(value === 0)
      navigation.goBack()
  }


  async function GoogleSignIn() {
    const user = await signInWithGoogle();
    if (await user !== 0) {
      showToast("success", "Great!", "Welcome back " + user.additionalUserInfo.profile.given_name + " :D");
      navigation.goBack()
    }
    else
      navigation.push('CompleteRegistrationPage')
  }

  // Handle user state changes
  function onAuthStateChanged() {
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const start = () => {
      return onAuthStateChange(onAuthStateChanged); // unsubscribe on unmount
    }
    start()
  }, []);

  if (initializing) {
    return null;
  }

    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{backgroundColor: "#3F799D"}}>
        <StatusBar backgroundColor={'#3F799D'} barStyle={'light-content'}/>
        <VStack style={styles.container}>
          <Text style={styles.subtitle}>Sign in now to access and share your trips and destinations.</Text>
          <Controller
            control={control}
            rules={{
              required: { value: true, message: "Missing e-mail" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                color={'white'}
                onChangeText={onChange}
                autoCapitalize={"none"}
                label={"Email Address"}
                value={value}
                underlineColor={'#BEC2C2'}
                activeUnderlineColor={'white'}
                error={errors.email}
                theme={{ colors: {placeholder: '#BEC2C2', text: 'white'} }}
              />
            )}
            name="email"
          />

          {captions(errors.email)}

          <Controller
            control={control}
            rules={{
              required: { value: true, message: "Missing password" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                right={
                  <TextInput.Icon
                    style={{ marginTop: 50 }}
                    size={25}
                    color={"white"}
                    name={show ? "eye-off-outline" : "eye-outline"}
                    onPress={handleHideShowPassword}
                  />
                }
                style={styles.input}
                onBlur={onBlur}
                color={'white'}
                underlineColor={'#BEC2C2'}
                activeUnderlineColor={'white'}
                autoCapitalize={"none"}
                onChangeText={onChange}
                value={value}
                label={'Password'}
                secureTextEntry={!show}
                error={errors.password}
                theme={{ colors: {placeholder: '#BEC2C2', text: 'white'} }}
              />
            )}
            name="password"
          />

          {captions(errors.password)}

          <Text style={{color: 'rgba(255, 255, 255, 0.7)', alignSelf: 'flex-end'}}>Forgot password?</Text>

          <View>
            <Button onPress={handleSubmit(EmailLogin)} style={styles.button} labelStyle={styles.loginButton} label={'LOGIN'} />

            <HStack alignItems={"center"} justifyContent={"center"} alignContent={"stretch"} marginBottom={21}>
              <Text style={styles.text}>Don't have an account?</Text><Pressable
              onPress={() => {reset(); navigation.push("Registration")}}><Text style={{ color: "white", fontWeight: "bold", fontFamily: 'Barlow'}}> Sign
              Up</Text></Pressable>
            </HStack>
          </View>

          <View style={styles.boxButton}>
            <Button style={{backgroundColor: '#de5246', borderColor: '#de5246', borderRadius: 10, height: 50}}
                    onPress={() => GoogleSignIn().catch(error => showToast('error', 'Google login error', error.message))}><Icon name={'google'} size={30} color={'white'} /></Button>
          </View>
        </VStack>
      </ScrollView>
    );

}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: '100%',
    paddingTop: 0,
    padding: 30
  },
  button: {
    backgroundColor: "#E05D5B",
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0)',
    marginTop: 20,
    marginBottom: 20,
    height: 50
  },
  input: {
    paddingTop: 20,
    backgroundColor: '#3F799D',
    color: "white",
    width: "100%",
    fontFamily: 'Barlow',
    fontSize: 20,
    alignSelf: "center",
  },
  text: {
    fontFamily: 'Barlow',
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  subtitle: {
    fontFamily: 'Barlow',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    paddingBottom: 40
  },
  loginButton: {
    fontFamily: 'Barlow',
    fontWeight: '700'
  }
});
