import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, RefreshControl } from "react-native";
import { TripCollection } from "../../api/FirebaseApi";

export default function HomePage() {

  const [trips, setTrips] = useState(TripCollection.getAll())
  //console.log(trips._W.Place);
  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = () => {
    setRefreshing(true);
    setTrips(TripCollection.getAll());
    setRefreshing(false);
  }

  return (
    <View>
      <SafeAreaView style={styles.container}>
        <View>
          <Text>This is the home Page</Text>

          <FlatList
            keyExtractor={(item, index)=>index.toString()}
            data={trips}
            renderItem={({item})=>(
              <View>
                <Text style={styles.text}>{item}</Text>
              </View>
            )}
            refreshControl = {<RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff00ff']}
            />}
          />

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
