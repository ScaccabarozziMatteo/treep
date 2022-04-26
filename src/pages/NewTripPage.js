import {HStack, View, VStack} from 'native-base';
import {StyleSheet, Text, TextInput} from 'react-native';
import React, {useState} from 'react';

export default function NewTripPage() {
  const [trips, setTrips] = useState({
    description: '',
    coverPhoto: '',
    location: '',
    photoURL: '',
    title: '',
    status: false,
  });

  return (
    <View>
      {/* Description */}
      <VStack>
        <HStack
          alignItems={'center'}
          justifyContent={'space-between'}
          alignContent={'stretch'}>
          <Text style={styles.title}>About me</Text>
        </HStack>

       
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    color: 'black',
  },
});
