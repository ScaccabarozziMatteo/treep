import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, ScrollView } from "native-base";
import { Button } from "react-native-elements";
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialIcons";
import { UserCollection } from "../../api/FirebaseApi";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ProfilePage from "./ProfilePage";
import { showToast } from "../../utils/Utils";

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleHideShowPassword = () => setShow(!show);

  // Login using email and password
  function emailLogin(userData) {
    // Wipe variables
    UserCollection.emailLogin(userData)
      .then(r => onAuthStateChanged(r.user))
      .catch(error1 => showToast("error", "Error", error1.message));
  }


  async function GoogleSignIn() {
    let user = await UserCollection.signInWithGoogle();
    showToast("success", "Great!", "Welcome back " + user.additionalUserInfo.profile.given_name + " :D");
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }


  useEffect(() => {
    return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <ScrollView>
        <View style={{width: '80%', alignSelf: 'center'}}>
          <Text
            style={{
              color: "black",
              paddingTop: 30,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
            }}>
            E-Mail
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={"Type your e-mail"}
                placeholderTextColor="grey"
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={{ color: "red", alignSelf: "center" }}>
              This is required.
            </Text>
          )}

          <Text
            style={{
              color: "black",
              paddingTop: 30,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
            }}>
            Password
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                InputRightElement={
                  <Icon
                    style={{ paddingRight: 10 }}
                    size={25}
                    color={"black"}
                    name={show ? "visibility-off" : "visibility"}
                    onPress={handleHideShowPassword}
                  />
                }
                placeholder={"Password"}
                placeholderTextColor="grey"
                onChangeText={onChange}
                value={value}
                secureTextEntry={!show}
              />
            )}
            name="password"
          />


          {errors.password && (
            <Text style={{ color: "red", alignSelf: "center" }}>
              This is required.
            </Text>
          )}

          <View style={styles.boxButton}>
            <Button title={'Login'} onPress={handleSubmit(emailLogin)} />
          </View>


          <View style={styles.boxButton}>
            <Button title={'Sign Up'} onPress={() => navigation.push("Registration")} />
          </View>


          <View style={styles.boxButton}>
            <Button title={'Google'}
              onPress={() => GoogleSignIn().catch(error => console.log(error.message))} />
          </View>
        </View>
      </ScrollView>
    );
  }
  // Else if the user is logged, show they're profile page
  return (
    <ProfilePage user={user} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // row
    alignItems: "center",
    backgroundColor: "grey",
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
