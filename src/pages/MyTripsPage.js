import React, { useEffect, useState } from "react";
import { HStack, Pressable, ScrollView, View } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import { Text } from "@rneui/base";
import { Button } from "react-native-ui-lib";
import NewTripPage from "./NewTripPage";
import AroundMePage from "./AroundMePage";
import * as TripCollection from "../api/TripApi";

export default function HomePage({ navigation }) {
  const [trips, setTrips] = useState({ description: "", coverPhoto: "" });

  useEffect(() => {
    TripCollection.getAll().then(response => {
      setTrips(response);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.button}>
          <Button
            title="Add new trip"
            onPress={() => navigation.navigate(NewTripPage)}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Around me"
            onPress={() => navigation.navigate(AroundMePage)}
          />
        </View>

        {/* Latest trips */}
        <Text style={styles.text}>Latest Trips</Text>
        <View style={styles.body}>
          <ScrollView horizontal={true}>
            <HStack space={3} alignItems="center">
              <Pressable onPress={() => navigation.navigate(NewTripPage)}>
                <View size={120} bg="primary.400" rounded="md" />
              </Pressable>
              <View size={120} bg="secondary.400" rounded="md" />
              <View size={120} bg="emerald.400" rounded="md" />
              <View size={120} bg="primary.400" rounded="md" />
            </HStack>
          </ScrollView>
        </View>

        {/* Countries */}
        <Text style={styles.text}>Countries</Text>
        <View style={styles.body}>
          <ScrollView horizontal={true}>
            <HStack space={3} alignItems="center">
              <View size={120} bg="primary.400" rounded="md" />
              <View size={120} bg="secondary.400" rounded="md" />
              <View size={120} bg="emerald.400" rounded="md" />
              <View size={120} bg="primary.400" rounded="md" />
            </HStack>
          </ScrollView>
        </View>

        {/* All trips */}
        <Text style={styles.text}>All Trips</Text>
        <View style={styles.body}>
          <ScrollView horizontal={true}>
            <HStack space={3} alignItems="center">
              <View size={120} bg="primary.400" rounded="md" />
              <View size={120} bg="secondary.400" rounded="md" />
              <View size={120} bg="emerald.400" rounded="md" />
              <View size={120} bg="primary.400" rounded="md" />
            </HStack>
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    width: "95%",
    height: 150,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  text: {
    flex: 1,
    fontSize: 20,
    margin: 3,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    flex: 1,
    width: "99%",
    height: 38,
    alignSelf: "center",
    margin: 3,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 1,
  },
});
