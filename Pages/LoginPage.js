import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function LoginPage() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  // eslint-disable-next-line react-hooks/exhaustive-deps,no-shadow
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
      <View>
        <Text>No user has logged in</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}
