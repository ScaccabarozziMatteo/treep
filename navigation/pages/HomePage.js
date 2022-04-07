import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, RefreshControl } from "react-native";
import { TripCollection } from "../../api/FirebaseApi";

export default function HomePage() {

  const [trips, setTrips] = useState(
    {description: "" ,
              coverPhoto: "",
    }
  )

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
      <SafeAreaView style={styles.container}>
        <View>


          <FlatList
            keyExtractor={(item, index)=>index.toString()}
            data={trips}
            renderItem={({item})=>(
              <View>
                <Text style={styles.text}>{item.description}</Text>
                <Image source = {{uri: item.coverPhoto}}/>
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
  text: {
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
    color: 'white',
  }
});
