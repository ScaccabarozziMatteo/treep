import {View, StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button, Datepicker, Input, Select} from '@ui-kitten/components';

export default function NewTripPage() {

  const [title, setTitle] = useState();

  const {
    control,
    formState: {errors},
  } = useForm();

  const captions = errors => {
    return errors ? (
      <Text style={{color: 'red', alignSelf: 'center'}}>{errors.message}</Text>
    ) : null;
  };

  return (
    <View style={{width: '80%', alignSelf: 'center'}}>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Missing trip title'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize={'words'}
            placeholder={'Title'}
            placeholderTextColor="grey"
            status={errors.trip ? 'danger' : 'basic'}
            label={'Title'}
            size={'large'}
            value={value}
            caption={captions(errors.title)}
          />
        )}
        name="title"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Missing trip location'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize={'words'}
            placeholder={'Location'}
            placeholderTextColor="grey"
            status={errors.trip ? 'danger' : 'basic'}
            label={'Location'}
            size={'large'}
            value={value}
            caption={captions(errors.location)}
          />
        )}
        name="location"
      />

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize={'words'}
            placeholder={'Description'}
            placeholderTextColor="grey"
            status={errors.description ? 'danger' : 'basic'}
            label={'Description'}
            size={'large'}
            value={value}
            caption={captions(errors.description)}
          />
        )}
        name="description"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text2: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    color: 'black',
  },
  container: {
    flex: 1,
    flexDirection: 'column', // row
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  boxButton: {
    paddingTop: 20,
    width: '40%',
    alignSelf: 'center',
  },
  checkbox: {},
  input: {
    color: 'black',
    alignSelf: 'center',
  },
  text: {
    color: 'black',
    textAlign: 'center',
  },
});
