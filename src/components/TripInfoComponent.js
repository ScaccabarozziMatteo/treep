import React, { useEffect, useState } from "react";
import {StyleSheet, Text, View } from "react-native";

const TripInfoComponent = (props) => {

  const [tripInfo, setTripInfo] = useState([
    {
      status: props.status,
      duration: props.duration,
      location: props.location,
      itinerary: props.itinerary,
    }
  ]);

  return(
    <View>
      {
        tripInfo.map((data, index) => {
          return(
            <View>
              {/* STATUS BOX*/}
              <View style={[styles.box, {height: 35}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>STATUS</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <Text style={{color: 'black'}}>Finished</Text>
                </View>
              </View>

              {/* LOCATION BOX*/}
              <View style={[styles.box, {height: 35}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>LOCATION</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <Text style={{color: 'black'}}>India</Text>
                </View>
              </View>
              {/* DURATION BOX*/}
              <View style={[styles.box, {height: 35}]}>
                <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20,}}>
                  <Text style={styles.title}>DURATION</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <Text style={{color: 'black'}}>2 days</Text>
                </View>
              </View>
              {/* ITINERARY BOX*/}
              <View style={styles.box}>

              </View>

            </View>
          )
        })
      }
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
