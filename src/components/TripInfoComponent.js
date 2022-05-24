import React, { useContext } from "react";
import {StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { requestLocationPermission } from "../pages/AroundMePage";
import { DetailsInfoContext } from "../contexts/DetailsInfoContext";

const TripInfoComponent = ({route}) => {

  const status = useContext(DetailsInfoContext).status;
  const startDate = useContext(DetailsInfoContext).startDate;
  const endDate = useContext(DetailsInfoContext).endDate;


  const latitude = 45.4642;
  const longitude = 9.1900;
  const nearbyRadius = 4;

  return(
            <View style={{backgroundColor: 'white'}}>
              {/* STATUS BOX*/}
              <View style={[styles.box, {height: '10%'}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>STATUS</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>

                  <Text style={{color: 'black', fontFamily: 'barlow'}}>{status ? "Active" : "Finished"}</Text>


                </View>
              </View>

              {/* LOCATION BOX*/}
              <View style={[styles.box, {height: '10%'}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>START DATE</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <Text style={{color: 'black', fontFamily: 'barlow'}}>{startDate}</Text>
                </View>
              </View>
              {/* DURATION BOX*/}
              <View style={[styles.box, {height: '10%'}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>END DATE</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <Text style={{color: 'black', fontFamily: 'barlow'}}>{endDate}</Text>
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
    shadowOffset: {width: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowColor: "rgba(82, 130, 255, 0.5)",
    elevation: 8,
    flexDirection: 'row',
    fontFamily: 'barlow'

  },
  title: {
    color: 'blue',
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: 'barlow'
  }
})

export default TripInfoComponent;
