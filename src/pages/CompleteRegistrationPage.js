import { BackHandler, ScrollView, StatusBar, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { HStack, Stack, View, VStack } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { Datepicker, Input } from "@ui-kitten/components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { completeProfile, googleUser, logout } from "../api/UserApi";
import { Picker, Button, DateTimePicker } from "react-native-ui-lib";
import { TextInput } from "react-native-paper";


export default function CompleteRegistrationPage({ navigation }) {

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const maxDate = new Date(2010, 12, 31);
  const minDate = new Date(1900, 1, 1);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();


  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      logout();
      navigation.goBack();
    });
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const updateDefaultValue = async () => {
      const google = await googleUser()
      setFirstName(google.user.givenName)
      setValue("first_name", firstName);
      setLastName(google.user.familyName)
      setValue("last_name", lastName);
    }

    updateDefaultValue()
  }, []);

  const captions = (errors) => {
    return (
      (errors) ? (
        <Text style={styles.errorText}>
          {errors.message}
        </Text>
      ) : null
    );
  };

  return (
    <ScrollView keyboardShouldPersistTaps={"handled"} style={{backgroundColor: 'black'}}>
      <StatusBar backgroundColor={"black"} barStyle={"light-content"} />
      <VStack style={styles.container}>
        <Text style={styles.subtitle}>Sign in now to access and share your trips and destinations.</Text>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing first name" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={"words"}
              error={errors.first_name}
              label={"First Name"}
              color={"white"}
              underlineColor={"#BEC2C2"}
              activeUnderlineColor={"white"}
              value={value}
              theme={{ colors: { placeholder: "#BEC2C2", text: "white" } }}
            />
          )}
          name="first_name"
        />
        {captions(errors.first_name)}

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing last name" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={"words"}
              error={errors.first_name}
              label={"Last Name"}
              color={"white"}
              underlineColor={"#BEC2C2"}
              activeUnderlineColor={"white"}
              value={value}
              theme={{ colors: { placeholder: "#BEC2C2", text: "white" } }}
            />
          )}
          name="last_name"
        />
        {captions(errors.last_name)}

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Please, select your sex" },
          }}
          render={({ field: { onBlur, value } }) => (
            <Picker
              placeholder={"Sex"}
              style={styles.pickerText}
              value={value}
              error={errors.sex !== undefined}
              onBlur={onBlur}
              floatingPlaceholder
              onChange={item => {
                setValue("sex", item);
                setError("sex", false);
              }}>
              <Picker.Item labelStyle={{fontFamily: 'Barlow'}} value={"Male"} label={"Male"} />
              <Picker.Item value={"Female"} label={"Female"} />
              <Picker.Item value={"Other"} label={"Other"} />
            </Picker>
          )}
          name="sex"
        />
        {captions(errors.sex)}


        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Please, select a date." },
          }}
          render={({ field: { onBlur, value } }) => (
            <DateTimePicker
              minimumDate={minDate}
              maximumDate={maxDate}
              floatingPlaceholder
              error={errors.birthdate !== undefined}
              style={styles.pickerText}
              placeholder="Birthdate"
              onBlur={onBlur}
              required
              onChange={date => setValue("birthdate", date)}
            />
          )}
          name="birthdate"
        />

          <Button labelStyle={styles.labelButton} label={'Complete Registration'} onPress={handleSubmit(async (form) => {
            await completeProfile(form);
            await navigation.navigate("Profile", { update: Math.random() });
          })} style={styles.button} />

      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: "center",
  },
  boxButton: {
    paddingTop: 20,
    width: "40%",
    alignSelf: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: 'Barlow',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    paddingBottom: 40
  },
  errorText: {
    color: "red",
    alignSelf: "center",
    fontFamily: 'Barlow'
  },
  labelButton: {
    fontFamily: "Barlow",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#3F799D",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 50,
    marginBottom: 20,
    height: 50,
  },
  input: {
    paddingTop: 0,
    backgroundColor: "black",
    color: "white",
    width: "100%",
    fontFamily: "Barlow",
    fontSize: 20,
    alignSelf: "center",
  },
});
