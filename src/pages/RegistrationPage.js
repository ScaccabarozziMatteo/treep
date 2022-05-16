import { ScrollView, VStack, HStack, View } from "native-base";
import React, { useState } from "react";
import { Button, Picker, DateTimePicker } from "react-native-ui-lib";
import { Controller, useForm } from "react-hook-form";
import { StatusBar, StyleSheet } from "react-native";
import { emailRegistration } from "../api/UserApi";
import { Text } from "react-native";
import { Checkbox, TextInput } from "react-native-paper";


export default function RegistrationPage({ navigation }) {

  const [show, setShow] = useState(false);
  const [checked, setCheck] = useState(false);

  const maxDate = new Date(2009, 11, 31)
  const minDate = new Date(1900, 0, 1);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      repeat_password: "",
      sex: "",
      birthdate: "",
    },
  });

  function setCheckCheckbox() {
    setCheck(!checked);
  }

  function firstModule() {
    return (
      <VStack>
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
              error={errors.last_name}
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

        <View paddingTop={0} marginBottom={-2} >
          <Controller
            control={control}
            rules={{
              required: { value: true, message: "Please, select your sex" },
            }}
            render={({ field: { onBlur, value } }) => (

              <Picker
                placeholder={"Sex"}
                style={styles.pickerText}
                floatingPlaceholderStyle={{fontFamily: 'Barlow', fontSize: 20}}
                floatingPlaceholderColor={'#BEC2C2'}
                placeholderTextColor={errors.sex ? "red" : "#BEC2C2"}
                value={value}
                onBlur={onBlur}
                underlineColor={errors.sex ? "red" : "#BEC2C2"}
                floatingPlaceholder
                onChange={item => {
                  setValue("sex", item);
                  clearErrors('sex')
                }}>
                <Picker.Item labelStyle={{fontFamily: 'Barlow'}} value={"Male"} label={"Male"} />
                <Picker.Item value={"Female"} label={"Female"} />
                <Picker.Item value={"Other"} label={"Other"} />
              </Picker>
            )}
            name="sex"
          />
          <View style={{ marginTop: -25 }}>
            {captions(errors.sex)}
          </View>

        </View>

        <View marginTop={2}>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Please, select your birthdate" },
          }}
          render={({ field: { onBlur, value } }) => (
            <DateTimePicker
              theme={{ colors: { placeholder: "#BEC2C2", text: "white" } }}
              placeholderTextColor={errors.birthdate ? "red" : "#BEC2C2"}
              floatingPlaceholderColor={'#BEC2C2'}
              floatingPlaceholderStyle={{fontFamily: 'Barlow', fontSize: 20}}
              value={value}
              underlineColor={errors.birthdate ? "red" : "#BEC2C2"}
              minimumDate={minDate}
              maximumDate={maxDate}
              floatingPlaceholder
              error={errors.birthdate !== undefined}
              style={styles.pickerText}
              placeholder="Birthdate"
              onBlur={onBlur}
              required
              onChange={date => {
                setValue("birthdate", date)
                clearErrors('birthdate')
              }}
            />
          )}
          name="birthdate"
        />
          <View style={{ marginTop: -25 }}>
            {captions(errors.birthdate)}
          </View>
        </View>

      </VStack>
    );
  }

  function secondModule() {
    return (
      <VStack style={{ marginTop: 0, paddingBottom: 100 }}>

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing e-mail" },
            // Check email using RegEx
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
              , message: "E-mail not valid.",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={"none"}
              error={errors.email}
              label={"E-mail"}
              color={"white"}
              underlineColor={"#BEC2C2"}
              activeUnderlineColor={"white"}
              value={value}
              theme={{ colors: { placeholder: "#BEC2C2", text: "white" } }}
            />
          )}
          name="email"
        />
        {captions(errors.email)}

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing password" },
            minLength: { value: 6, message: "Password too short, min 6 characters" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              right={
                <TextInput.Icon
                  size={25}
                  color={"white"}
                  name={show ? "eye-off-outline" : "eye-outline"}
                  onPress={handleHideShowPassword}
                />
              }
              onChangeText={onChange}
              autoCapitalize={"none"}
              value={value}
              secureTextEntry={!show}
              error={errors.password}
              label={"Password"}
              color={"white"}
              style={styles.input}
              underlineColor={"#BEC2C2"}
              activeUnderlineColor={"white"}
              theme={{ colors: { placeholder: "#BEC2C2", text: "white" } }}
            />
          )}
          name="password"
        />
        {captions(errors.password)}

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing password" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              right={
                <TextInput.Icon
                  size={25}
                  color={"white"}
                  name={show ? "eye-off-outline" : "eye-outline"}
                  onPress={handleHideShowPassword}
                />
              }
              onChangeText={onChange}
              autoCapitalize={"none"}
              value={value}
              type={"password"}
              secureTextEntry={!show}
              error={errors.repeat_password}
              label={"Repeat password"}
              color={"white"}
              underlineColor={"#BEC2C2"}
              activeUnderlineColor={"white"}
              theme={{ colors: { placeholder: "#BEC2C2", text: "white" } }}
            />
          )}
          name="repeat_password"
        />
        {captions(errors.repeat_password)}

        <HStack alignSelf={"stretch"} paddingTop={6} marginLeft={-5}>
          <Checkbox.Item onPress={setCheckCheckbox} status={checked ? "checked" : "unchecked"}
                         uncheckedColor={"white"}
                         position={"leading"}
                         color={"#32c8cb"}
                         labelStyle={styles.labelCheckbox}
                         label={"I agree with the treep policy"}
                         style={styles.checkbox} />
        </HStack>

        <Button disabled={!checked} style={checked ? styles.buttonEnabled : styles.buttonDisabled}
                label={"Create profile"}
                labelStyle={styles.labelButton}
                onPress={handleSubmit((form) => emailRegistration(form, navigation))} />

      </VStack>
    );
  }

  const captions = (errors) => {
    return (
      (errors) ? (
        <Text style={styles.errorText}>
          {errors.message}
        </Text>
      ) : null
    );
  };

  const handleHideShowPassword = () => setShow(!show);


  return (
    <View>
      <StatusBar backgroundColor={'#3F799D'} barStyle={'light-content'}/>
      <Text style={styles.subtitle}>Sign up now for free and start travelling, explore with Treep.</Text>
      <ScrollView style={styles.mainContainer} keyboardShouldPersistTaps={"handled"}>

        {firstModule()}
        {secondModule()}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "#3F799D",
    width: "100%",
  },
  boxButton: {
    paddingTop: 20,
    width: "100%",
    alignSelf: "center",
  },
  checkbox: {
    color: "white",
  },
  pickerText: {
    paddingTop: 0,
    color: "white",
    width: "100%",
    fontFamily: "Barlow",
    fontSize: 20,
    alignSelf: "center",
  },
  input: {
    paddingTop: 0,
    backgroundColor: "#3F799D",
    color: "white",
    width: "100%",
    fontFamily: "Barlow",
    fontSize: 20,
    alignSelf: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
  title: {
    color: "white",
    fontFamily: "Barlow",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    fontFamily: "Barlow",
    backgroundColor: "#3F799D",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonEnabled: {
    backgroundColor: "#E05D5B",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 5,
    marginBottom: 20,
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: "#999999",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 5,
    marginBottom: 20,
    height: 50,
  },
  labelButton: {
    fontFamily: "Barlow",
    fontWeight: "700",
  },
  labelCheckbox: {
    color: "white",
  },
  errorText: {
    color: "red",
    alignSelf: "center",
    fontFamily: 'Barlow'
  }
});
