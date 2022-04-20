import React, { useEffect, useState } from "react";

import { TripCollection } from "../api/FirebaseApi";
import { View } from "native-base";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { FlatList, Text, StyleSheet, RefreshControl, Image, ScrollView } from "react-native";

export default function HomePage() {

  const [trips, setTrips] = useState(
    {description: "" ,
              coverPhoto: "",
    }
  )

  useEffect( () => {
    TripCollection.getAll().then(
      response => {
        setTrips(response);
      }
    )}, []
  );

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true);

    TripCollection.getAll().then(
      response => {
        setTrips(response);
      }
    );

    setRefreshing(false);
  }

  return (
    <View>
      {/*
      <SafeAreaView style={styles.container}>
          <FlatList
            keyExtractor={(item, index)=>index.toString()}
            data={trips}
            renderItem={({item})=>(
              <View>
                <Text style={styles.text}>{item.description}</Text>
                <Image source = {{uri: item.coverPhoto}} style={{width: 100, height: 100}}/>
              </View>
            )}
            refreshControl = {<RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff00ff']}
            />}
          />

      </SafeAreaView>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
    color: 'white',
  }
});
