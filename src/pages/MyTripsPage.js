import React, {useEffect, useState} from 'react';
import {View} from 'native-base';
import {StyleSheet} from 'react-native';
import {Button} from '@rneui/base';
import NewTripPage from './NewTripPage';
import AroundMePage from './AroundMePage';
import * as TripCollection from '../api/TripApi';

export default function HomePage({navigation}) {
  const [trips, setTrips] = useState({description: '', coverPhoto: ''});

  useEffect(() => {
    TripCollection.getAll().then(response => {
      setTrips(response);
    });
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'column',
        },
      ]}>
      <Button
        onPress={() => navigation.navigate(NewTripPage)}
        title="Add new trip"
      />
      <Button
        onPress={() => navigation.navigate(AroundMePage)}
        title="Around me"
      />
      <View style={{flex: 2, backgroundColor: 'white'}} />
      <View style={{flex: 2, backgroundColor: 'lightgrey'}} />
      <View style={{flex: 2, backgroundColor: 'white'}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  image: {},

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    color: 'black',
  },
  boxButton: {
    paddingTop: 20,
    width: '40%',
    alignSelf: 'center',
  },
});
