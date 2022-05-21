import React, { useEffect, useState } from "react";
import { HStack, Pressable, ScrollView, View, VStack } from "native-base";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@rneui/base";
import { Button } from "react-native-paper";

export default function MyTripsPage({ navigation }) {
  const [trips, setTrips] = useState({ description: "", coverPhoto: "" });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <VStack style={styles.container}>
          <TouchableOpacity onPress={() => navigation.push("NewTrips")}>
            <Button
              icon={"plus"}
              uppercase={false}
              style={styles.topButton}
              labelStyle={styles.labelButton}
            >
              Create new trip
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.push("AroundMe")}>
            <Button
              icon={"google-maps"}
              uppercase={false}
              style={styles.topButton}
              labelStyle={styles.labelButton}
            >
              Users around me
            </Button>
          </TouchableOpacity>
        </VStack>

        {/* Latest trips */}
        <Text style={styles.text}>Latest Trips</Text>
        <View style={styles.body}>
          <ScrollView horizontal={true}>
            <HStack space={3} alignItems="center">
              <Pressable onPress={null}>
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
    alignSelf: "center",
    width: "100%",
    backgroundColor: 'white',
    paddingTop: 0,
    padding: 10,
  },
  scrollView: {
    marginHorizontal: 1,
    backgroundColor: 'white'
  },
  topButton: {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 20,
    width: "100%",
    alignItems: "flex-start",
    shadowColor: 'rgba(82, 130, 255, 0.5)',
    elevation: 10,
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 1
  },
  labelButton: {
    fontFamily: "Barlow",
    fontWeight: "400",
    color: "black",
    fontSize: 22,
    lineHeight: 24,
  },
});
