import React, { useEffect, useState } from "react";
import {StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { requestLocationPermission } from "../pages/AroundMePage";
import { getTripById } from "../api/TripApi";

const TripInfoComponent = ({route}) => {

  const status = route.params.status;
  const startDate = route.params.startDate;

  useEffect(  () => {
    const getTripData = async () => {
      console.log(addedDate);
    };
    getTripData();
  }, []);
  const latitude = 45.4642;
  const longitude = 9.1900;
  const nearbyRadius = 4;

  return(
            <View>
              {/* STATUS BOX*/}
              <View style={[styles.box, {height: '10%'}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>STATUS</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <Text style={{color: 'black'}}>{status ? "Finished" : "Active"}</Text>
                </View>
              </View>

              {/* LOCATION BOX*/}
              <View style={[styles.box, {height: '10%'}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>START DATE</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <Text style={{color: 'black'}}>{startDate}</Text>
                </View>
              </View>
              {/* DURATION BOX*/}
              <View style={[styles.box, {height: '10%'}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>END DATE</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <Text style={{color: 'black'}}>2 days</Text>
                </View>
              </View>
              {/* ITINERARY BOX*/}
              <View style={[styles.box, {height: '53%'}]}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{flex: 1}}
                    region={{
                      latitude: latitude,
                      longitude: longitude,
                      latitudeDelta: nearbyRadius*0.0922,
                      longitudeDelta: nearbyRadius*0.0421
                    }}
                    showsUserLocation>
                  <Marker
                    onPress={requestLocationPermission}
                    coordinate={{latitude: latitude, longitude: longitude}}
                    title={'Example'}
                    description={'This is a sample marker'}
                    style={{backgroundColor: 'blue'}}
                  />
                </MapView>
              </View>

            </View>
  )
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    width: '90%',
    marginHorizontal: '5%',
    borderRadius: 35,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',

  },
  title: {
    color: 'blue',
    fontSize: 17,
    fontWeight: "bold",

  }
})

export default TripInfoComponent;
