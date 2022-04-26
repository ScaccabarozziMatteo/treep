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

        {
          // User bio
          // Edit bio
          edit ? (
            <TextInput
              multiline
              defaultValue={newBio}
              onChange={text => setNewBio(text.nativeEvent.text)}
              placeholder={
                userData.bio !== undefined
                  ? userData.bio
                  : 'Set a description..'
              }
              placeholderTextColor={'grey'}
              style={{
                color: 'black',
                fontSize: 15,
                backgroundColor: 'yellow',
              }}
            />
          ) : // Ask user to add bio if it not exists
          userData.bio ? (
            <Text style={styles.text}>{userData.bio}</Text>
          ) : (
            // Show bio
            <TextInput
              placeholder={'Click to set a description..'}
              onSubmitEditing={data => changeBio(data.nativeEvent.text)}
              placeholderTextColor={'grey'}
              style={{
                color: 'grey',
                fontSize: 15,
              }}
              onPress={changeBio}
            />
          )
        }
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
