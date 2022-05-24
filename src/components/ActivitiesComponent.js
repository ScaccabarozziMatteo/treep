import React, { useContext, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "native-base";
import { DetailsInfoContext } from "../contexts/DetailsInfoContext";
import { Divider, ListItem } from "@ui-kitten/components";
import { currentUser } from "../api/UserApi";

const ActivitiesComponent = (props) => {

  const trip = useContext(DetailsInfoContext).trip;
  const tripID = useContext(DetailsInfoContext).tripID;

  console.log(trip.activities)

  function bodyMessage(item) {

    return (
      <View>
        <Text style={styles.bodyMessage}>{item.description}</Text>
        <Text style={styles.timeMessage}>{new Date(item.date.toDate()).toLocaleDateString()}</Text>
      </View>
    )
  }

  function renderItem({ item }) {
    return (
      <ListItem
        style={styles.container}
        title={() => <Text style={styles.title}>{item.activity_title.toUpperCase()}</Text>}
        description={() => bodyMessage(item)}
        ItemSeparatorComponent={Divider}
      />
    );
  }

  return(
    <ScrollView style={{backgroundColor: 'white'}}>
      {trip.activities ? (
        <FlatList
          style={{marginTop: 15}}
          data={trip.activities}
          keyExtractor={(item) => item.registrationDate}
          renderItem={renderItem}
        />) : null}
    </ScrollView>
  )
}

export default ActivitiesComponent;

const styles = StyleSheet.create({
  container: {
    maxHeight: 80,
    width: '90%',
    marginRight: 20,
    marginLeft: 20,
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: "white",
    shadowColor: "rgba(82, 130, 255, 0.5)",
    elevation: 8,
    borderRadius: 16
  },
  title: {
    marginLeft: 0,
    color: "#376AED",
    fontFamily: "Barlow",
    fontWeight: "800",
    fontSize: 17,
    lineHeight: 20,
  },
  description: {
    fontFamily: "Barlow",
    marginLeft: 0,
    color: "#0D253C",
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMessage: {
    fontFamily: "Barlow",
    alignSelf: "flex-start",
    color: "#0D253C",
    maxWidth: "80%",
    fontWeight: "500",
    marginTop: 5,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.24,
  },
  timeMessage: {
    fontFamily: "Barlow",
    marginLeft: 0,
    color: "grey",
    fontWeight: "500",
    marginBottom: 0,
    fontSize: 10,
    lineHeight: 17,
    alignSelf: 'flex-end',
    letterSpacing: -0.24,
  },

});
