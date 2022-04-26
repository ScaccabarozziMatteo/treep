import React, {useEffect, useState} from 'react';
import {TripCollection} from '../../api/FirebaseApi';
import {Container, View} from 'native-base';
import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import MyPosts from '../../components/MyPosts';
import {Button} from '@rneui/base';
import NewTripPage from './NewTripPage';
import AroundMePage from './AroundMePage';



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
        onPress={() => navigation.navigate('NewTripPage')}
        title="Add new trip"
      />
      <Button
        onPress={() => navigation.navigate('AroundMePage')}
        title="Around Me"
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
});
