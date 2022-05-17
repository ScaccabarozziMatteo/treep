import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {HStack, View, VStack} from 'native-base';
import {Button} from 'react-native-paper';
import React from 'react';
import {Text} from '@rneui/base';
import NewTripPage from './NewTripPage';

export default function MyTrips({navigation}) {
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <VStack style={styles.container}>
        <TouchableOpacity onPress={() => navigation.push('NewTrips')}>
          <Button
            color={'grey'}
            icon={'plus'}
            uppercase={false}
            style={styles.button}
            labelStyle={styles.labelButton}
            label={'Create new trip'}>
            Create new trip
          </Button>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.push('AroundMe')}>
          <Button
            color={'grey'}
            icon={'google-maps'}
            uppercase={false}
            style={styles.button}
            labelStyle={styles.labelButton}
            label={'Create new trip'}>
            Around me
          </Button>
        </TouchableOpacity>
      </VStack>

      <VStack style={styles.big_container}>
        {/* Latest trips */}
        <Text style={styles.text}>Latest Trips</Text>
        <VStack style={styles.small_container}>
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
        </VStack>

        {/* Countries */}
        <Text style={styles.text}>Countries</Text>
        <VStack style={styles.small_container}>
          <ScrollView horizontal={true}>
            <HStack space={3} alignItems="center">
              <View size={120} bg="primary.400" rounded="md" />
              <View size={120} bg="secondary.400" rounded="md" />
              <View size={120} bg="emerald.400" rounded="md" />
              <View size={120} bg="primary.400" rounded="md" />
            </HStack>
          </ScrollView>
        </VStack>

        {/* All trips */}
        <Text style={styles.text}>All Trips</Text>
        <VStack style={styles.small_container}>
          <ScrollView horizontal={true}>
            <VStack space={3}>
              <View size={300} bg="primary.400" rounded="md" alignSelf="center"/>
              <View size={300} bg="secondary.400" rounded="md" />
              <View size={300} bg="emerald.400" rounded="md" />
              <View size={300} bg="primary.400" rounded="md" />
            </VStack>
          </ScrollView>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    paddingTop: 0,
    padding: 30,
  },
  big_container: {
    alignSelf: 'center',
    width: '100%',
    paddingTop: 0,
    padding: 20,
  },
  small_container: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#D2D2D2',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0)',
    marginTop: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  labelButton: {
    fontFamily: 'Barlow',
    fontWeight: '400',
    color: 'black',
    fontSize: 22,
    lineHeight: 24,
  },
});
