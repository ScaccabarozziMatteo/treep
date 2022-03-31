import React, { useEffect, useState } from "react";
import { Text, TextInput, View, Button, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";

export default function LoginPage() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();


  const textInputStyle = {
    color: 'white',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    fontSize: 15,
    width: '80%'
  };

function emailLogin() {
  auth().signInWithEmailAndPassword(email, password)
    .then(r => onAuthStateChanged(r.user))
    .catch(error1 => console.log(error1));
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
      <View style={styles.container}>
        <Text style={{paddingBottom: 20}}>No user has logged in</Text>
        <TextInput
          style={textInputStyle}
          accessibilityLabel={"Email"}
          placeholder={"E-Mail"}
          onChangeText={setEmail}
          value={email}
          placeholderTextColor={'grey'}

        />
        <TextInput
          style={textInputStyle}
          accessibilityLabel={"Password"}
          placeholder={"Password"}
          placeholderTextColor={'grey'}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        <View style={styles.boxButton}>
        <Button
          onPress={emailLogin}
          title='Login '
        />
        </View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column', // row
      alignItems: 'center',
    },
  boxButton: {
      paddingTop: 20
  }})

