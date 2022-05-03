import { BackHandler, ScrollView, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { HStack, Stack, View, VStack } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { Button, Datepicker, Input, Select, SelectItem } from "@ui-kitten/components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { completeProfile, currentUser, googleUser, logout } from "../api/UserApi";

export default function CompleteRegistrationPage({ navigation }) {

  const [selectedIndex, setSelectedIndex] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const maxDate = new Date(2010, 12, 31);
  const minDate = new Date(1900, 1, 1);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const data = [
    "Male",
    "Female",
    "Other",
  ];

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


  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  const captions = (errors) => {
    return (
      (errors) ? (
        <Text style={{ color: "red", alignSelf: "center" }}>
          {errors.message}
        </Text>
      ) : null
    );
  };

  return (
    <ScrollView keyboardShouldPersistTaps={"handled"}>
      <View style={{ width: "80%", alignSelf: "center" }}>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing first name." },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={"words"}
              placeholder={"First Name"}
              defaultValue={firstName}
              placeholderTextColor="grey"
              status={errors.first_name ? "danger" : "basic"}
              label={"First Name"}
              size={"large"}
              value={value}
              caption={captions(errors.first_name)}
            />
          )}
          name="first_name"
        />

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing last name." },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={"words"}
              placeholder={"Last Name"}
              defaultValue={lastName}
              placeholderTextColor="grey"
              status={errors.last_name ? "danger" : "basic"}
              label={"Last Name"}
              size={"large"}
              value={value}
              caption={captions(errors.last_name)}
            />
          )}
          name="last_name"
        />

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Please, select a choice." },
          }}
          render={({ field: { onBlur, value } }) => (
            <Select
              label={"Sex"}
              size={"large"}
              placeholder={"Sex"}
              value={value}
              selectedIndex={selectedIndex}
              onBlur={onBlur}
              caption={captions(errors.sex)}
              status={errors.sex ? "danger" : "basic"}
              onSelect={index => {
                setSelectedIndex(index);
                setValue("sex", data[index.row]);
              }}>
              {data.map(renderOption)}
            </Select>
          )}
          name="sex"
        />

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Please, select a date." },
          }}
          render={({ field: { onBlur, value } }) => (
            <Datepicker
              min={minDate}
              max={maxDate}
              label="Birth date"
              caption={captions(errors.birthdate)}
              placeholder="Birth date"
              status={errors.birthdate ? "danger" : "basic"}
              date={value}
              onBlur={onBlur}
              size={"large"}
              onSelect={date => setValue("birthdate", date)}
              accessoryRight={
                <Icon
                  style={{ paddingRight: 10 }}
                  size={22}
                  color={"black"}
                  name={"calendar-today"}
                />
              }
            />
          )}
          name="birthdate"
        />

        <VStack alignItems={"center"} style={{ width: "100%" }}>
          <Button onPress={handleSubmit(async (form) => {
            await completeProfile(form);
            await navigation.navigate("Profile", { update: Math.random() });
          })} status={"success"} style={{ width: "60%" }}>
            Complete Registration
          </Button>
        </VStack>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // row
    alignItems: "center",
    backgroundColor: "grey",
  },
  boxButton: {
    paddingTop: 20,
    width: "40%",
    alignSelf: "center",
  },
  checkbox: {},
  input: {
    color: "black",
    alignSelf: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
});
