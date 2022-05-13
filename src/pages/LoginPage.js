import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Pressable, VStack, HStack, ScrollView } from "native-base";
import { Input } from "@ui-kitten/components";
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { emailLogin, signInWithGoogle, onAuthStateChange } from "../api/UserApi";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ProfilePage from "./ProfilePage";
import { showToast } from "../utils/Utils";
import CompleteRegistrationPage from "./CompleteRegistrationPage";
import { Text } from "@rneui/base";
import { Button, Incubator } from "react-native-ui-lib";

GoogleSignin.configure({
  webClientId: "890037553856-u31q3091loeoqf2gelsme90vtef5qr24.apps.googleusercontent.com",
  forceConsentPrompt: true,
  offlineAccess: true,
});

export default function LoginPage({ navigation, route }) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
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
  function EmailLogin(userData) {
    emailLogin(userData).catch(error1 => showToast("error", "Error", error1.message));
  }


  async function GoogleSignIn() {
    const user = await signInWithGoogle();
    if (await user !== 0) {
      showToast("success", "Great!", "Welcome back " + user.additionalUserInfo.profile.given_name + " :D");
    }
    else
      navigation.navigate(CompleteRegistrationPage)
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
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

  if (!user) {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{backgroundColor: "black"}}>
        <View style={{alignSelf: "center", marginTop: '10%'}}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Sign in now to access and share your trips and destinations.</Text>
          <Controller
            control={control}
            rules={{
              required: { value: true, message: "Missing e-mail." },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Incubator.TextField
                style={styles.input}
                onBlur={onBlur}
                floatingPlaceholder
                onChangeText={onChange}
                autoCapitalize={"none"}
                placeholder={"E-Mail"}
                value={value}
                status={errors.email ? "danger" : "basic"}
                caption={captions(errors.email)}
              />
            )}
            name="email"
          />


          <Controller
            control={control}
            rules={{
              required: { value: true, message: "Missing password." },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                accessoryRight={
                  <Icon
                    style={{ paddingRight: 10 }}
                    size={25}
                    color={"black"}
                    name={show ? "eye-off-outline" : "eye-outline"}
                    onPress={handleHideShowPassword}
                  />
                }
                placeholder={"Password"}
                autoCapitalize={"none"}
                placeholderTextColor="grey"
                onChangeText={onChange}
                value={value}
                size={'large'}
                label={'Password'}
                secureTextEntry={!show}
                status={errors.password ? "danger" : "basic"}
                caption={captions(errors.password)}
              />
            )}
            name="password"
          />

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
            <Button style={{backgroundColor: '#de5246', borderColor: '#de5246', borderRadius: 10, height: 45}}
                    onPress={() => GoogleSignIn().catch(error => console.log(error.message))}><Icon name={'google'} size={20} color={'white'} /></Button>
          </View>
        </View>
      </ScrollView>
    );
  }
  // Else if the user is logged, show they're profile page
  return (
    <ProfilePage navigation={navigation} showHeader={false} update={route.params} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // row
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3F799D",
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0)',
    marginTop: 20,
    marginBottom: 20
  },
  input: {
    color: "white",
    width: "80%",
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
  title: {
    color: "white",
    fontFamily: 'Barlow',
    fontSize: 30,
    fontWeight: "bold"
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
