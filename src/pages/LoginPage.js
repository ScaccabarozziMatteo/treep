import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable, ScrollView, Stack } from "native-base";
import { Button, Input } from "@ui-kitten/components";
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { emailLogin, signInWithGoogle } from "../api/FirebaseApi";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ProfilePage from "./ProfilePage";
import { showToast } from "../utils/Utils";
import CompleteRegistrationPage from "./CompleteRegistrationPage";

GoogleSignin.configure({
  webClientId: "890037553856-u31q3091loeoqf2gelsme90vtef5qr24.apps.googleusercontent.com",
  forceConsentPrompt: true,
  offlineAccess: true,
});

export default function LoginPage({ navigation }) {
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
    reset()
    return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={{alignSelf: "center", marginTop: '10%'}}>
          <Controller
            control={control}
            rules={{
              required: { value: true, message: "Missing e-mail." },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={styles.input}
                onBlur={onBlur}
                size={'large'}
                label={'E-Mail'}
                onChangeText={onChange}
                autoCapitalize={"none"}
                placeholder={"E-Mail"}
                placeholderTextColor="grey"
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

          <Text style={{color: 'black', alignSelf: 'flex-end'}}>Forgot password?</Text>

          <View>
            <Button onPress={handleSubmit(EmailLogin)}>Login</Button>

            <Stack direction={'row'}>
              <Text style={styles.text}>Need an account?</Text><Pressable
              onPress={() => {reset(); navigation.push("Registration")}}><Text style={{ color: "purple" }}>Sign
              Up</Text></Pressable><Text style={styles.text}> now!</Text>
            </Stack>
          </View>

          <View style={styles.boxButton}>
            <Button style={{backgroundColor: '#de5246', borderColor: '#de5246'}}
                    onPress={() => GoogleSignIn().catch(error => console.log(error.message))}><Icon name={'google'} /></Button>
          </View>
        </View>
      </ScrollView>
    );
  }
  // Else if the user is logged, show they're profile page
  return (
    <ProfilePage />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // row
    alignItems: "center",
  },
  boxButton: {
    paddingTop: 20,
    width: "100%",
    alignSelf: "center",
  },
  input: {
    color: "black",
    width: "80%",
    alignSelf: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
});
