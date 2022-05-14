import { ScrollView, VStack, HStack, View } from "native-base";
import React, { useState } from "react";
import { Input, CheckBox, Datepicker } from "@ui-kitten/components";
import { Button } from "react-native-ui-lib";
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet } from "react-native";
import { emailRegistration } from "../api/UserApi";
import { Select, SelectItem } from "@ui-kitten/components";
import { Text } from "react-native";
import { TextInput } from "react-native-paper";


export default function RegistrationPage({ navigation }) {

  const [show, setShow] = useState(false);
  const [checked, setCheck] = useState(false);
  const [status, setStatus] = useState(0);
  const [progress, setProgress] = useState(0.5);
  const [selectedIndex, setSelectedIndex] = useState();

  const maxDate = new Date(2010, 12, 31);
  const minDate = new Date(1900, 1, 1);

  const {
    control,
    handleSubmit,
    setValue,
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

  const data = [
    "Male",
    "Female",
    "Other",
  ];

  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  function setCheckCheckbox() {
    setCheck(!checked);
  }

  function firstModule(visibility) {
    return (
      <VStack style={styles.container}>
          <Text style={styles.subtitle}>Sign up now for free and start travelling, explore with Treep.</Text>
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
              color={'white'}
              underlineColor={'#BEC2C2'}
              activeUnderlineColor={'white'}
              value={value}
              theme={{ colors: {placeholder: '#BEC2C2', text: 'white'} }}
            />
          )}
          name="first_name"
        />

        {captions(errors.first_name)}

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing last name." },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={"words"}
              error={errors.last_name}
              label={"Last Name"}
              color={'white'}
              underlineColor={'#BEC2C2'}
              activeUnderlineColor={'white'}
              value={value}
              theme={{ colors: {placeholder: '#BEC2C2', text: 'white'} }}
            />
          )}
          name="last_name"
        />
        {captions(errors.last_name)}

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

      </VStack>
    );
  }

  function secondModule(visibility) {
    return (
      <View style={{ opacity: visibility }}>

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing e-mail." },
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
              color={'white'}
              underlineColor={'#BEC2C2'}
              activeUnderlineColor={'white'}
              value={value}
              theme={{ colors: {placeholder: '#BEC2C2', text: 'white'} }}
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
                  style={{ marginRight: 10, marginTop: 50 }}
                  size={25}
                  color={"white"}
                  name={show ? "eye-off-outline" : "eye-outline"}
                  onPress={handleHideShowPassword}
                />
              }
              placeholder={"Password"}
              onChangeText={onChange}
              autoCapitalize={"none"}
              value={value}
              secureTextEntry={!show}
              error={errors.password}
              label={"Password"}
              color={'white'}
              style={styles.input}
              underlineColor={'#BEC2C2'}
              activeUnderlineColor={'white'}
              theme={{ colors: {placeholder: '#BEC2C2', text: 'white'} }}
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
                  style={{ marginRight: 10, marginTop: 50  }}
                  size={25}
                  color={"white"}
                  name={show ? "eye-off-outline" : "eye-outline"}
                  onPress={handleHideShowPassword}
                />
              }
              placeholder={"Repeat your password"}
              onChangeText={onChange}
              autoCapitalize={"none"}
              value={value}
              type={"password"}
              secureTextEntry={!show}
              error={errors.repeat_password}
              label={"Repeat password"}
              color={'white'}
              underlineColor={'#BEC2C2'}
              activeUnderlineColor={'white'}
              theme={{ colors: {placeholder: '#BEC2C2', text: 'white'} }}
            />
          )}
          name="repeat_password"
        />
        {captions(errors.repeat_password)}

        <CheckBox onChange={setCheckCheckbox} checked={checked}
                  style={styles.checkbox}>I agree with the treep policy</CheckBox>

          <Button disabled={!checked} style={styles.button}
                  label={'Create profile'}
                  labelStyle={styles.labelButton}
                  onPress={handleSubmit((form) => emailRegistration(form, navigation))} />


      </View>
    );
  }

  const captions = (errors) => {
    return (
      (errors) ? (
        <Text style={{ color: "red", alignSelf: "center" }}>
          {errors.message}
        </Text>
      ) : null
    );
  };

  const handleHideShowPassword = () => setShow(!show);


  return (
    <ScrollView style={styles.mainContainer} keyboardShouldPersistTaps={"handled"}>

      {firstModule()}
      {secondModule()}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "black",
    width: "100%",
  },
  container: {},
  boxButton: {
    paddingTop: 20,
    width: "100%",
    alignSelf: "center",
  },
  checkbox: {},
  input: {
    paddingTop: 20,
    backgroundColor: 'black',
    color: "white",
    width: "100%",
    fontFamily: 'Barlow',
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
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3F799D",
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0)',
    marginTop: 20,
    marginBottom: 20,
    height: 50
  },
  labelButton: {
    fontFamily: 'Barlow',
    fontWeight: '700'
  }
});
