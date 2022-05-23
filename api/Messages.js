import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import admin from 'firebase/compat';

function Messages() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
}

// yet unclear what this is for
admin.messaging().sendToDevice(
  [], // device fcm tokens...
  {
    data: {
      owner: JSON.stringify(this.owner),
      user: JSON.stringify(this.user),
      picture: JSON.stringify(this.picture),
    },
  },
  {
    // Required for background/quit data-only messages on iOS
    contentAvailable: true,
    // Required for background/quit data-only messages on Android
    priority: 'high',
  },
);
