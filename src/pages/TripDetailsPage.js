import * as React from "react";
import { useEffect, useState } from "react";
import { getAll, getTripById } from "../api/TripApi";
import { View } from "react-native";
import { Text } from "native-base";

export default function UserProfile({ navigation, route }) {

  const tripID = route.params.tripId;
  const [tripData, setTripData] = useState([
    {
      coverPhoto: "",
      userPhoto: "",
      userID: "",
      location: "",
      photoURL: "",
      username: "",
      title: "",
      postID: "",
      isLiked: false,
      isWished: false,
    }
  ]);

  useEffect( () => {
      getTripById(tripID).then(
        response => {
          setTripData(response);
        });
    }, []
  );

  return(
    <View>

    </View>
  );

}
