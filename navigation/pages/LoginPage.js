import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Input, ScrollView, Button } from "native-base";
import { useForm, Controller } from "react-hook-form";
import auth from "@react-native-firebase/auth";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function LoginPage() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [error, setError] = useState("");
  const [show, setShow] = React.useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleHideShowPassword = () => setShow(!show);

  // Login using email and password
  function emailLogin(userData) {
    // Wipe variables
    setError('')
    setShow(false)
    auth().signInWithEmailAndPassword(userData.email, userData.password)
      .then(r => onAuthStateChanged(r.user))
      .catch(error1 => setError(error1.message));
  }

  // Logout function
  function logout() {
    auth().signOut().then(r => null).catch(error1 => setError(error1));
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
  }, [onAuthStateChanged]);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (

      <ScrollView>
        <View>
          <Text style={styles.text}>No user has logged in! Please sign in :D</Text>
          <Text style={{
            color: "black",
            paddingTop: 30,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}>E-Mail</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={styles.input}
                onBlur={onBlur}
                width= '80%'
                alignSelf='center'
                onChangeText={onChange}
                placeholder={"Type your e-mail"}
                placeholderTextColor="grey"
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && <Text style={{ color: "red", alignSelf: "center" }}>This is required.</Text>}

          <Text style={{
            color: "black",
            paddingTop: 30,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}>Password</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                width= '80%'
                alignSelf='center'
                onBlur={onBlur}
                InputRightElement={<Icon style={{paddingRight:10}} size={25} color={'black'} name={show? 'visibility-off' : 'visibility'} onPress={handleHideShowPassword}/>}
                placeholder={"Password"}
                placeholderTextColor="grey"
                onChangeText={onChange}
                value={value}
                secureTextEntry={!show}
              />
            )}
            name="password"
          />


          {errors.password && <Text style={{ color: "red", alignSelf: "center" }}>This is required.</Text>}

          <View style={styles.boxButton}>
            <Button onPress={handleSubmit(emailLogin)} >Login </Button>
          </View>

          <Text style={styles.text}>{error}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View>
      <Text style={styles.text}>Welcome {user.email}</Text>
      <View style={styles.boxButton}>
        <Button onPress={logout}>Logout </Button>
      </View>
    </View>
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
    textAlign: "center",
  },
});

