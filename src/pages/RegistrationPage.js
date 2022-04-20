import { ScrollView, Stack, View } from "native-base";
import React, { useState } from "react";
import { Input, Text, CheckBox, Button } from '@ui-kitten/components';
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";
import ModalPhoto from "../utils/ModalPhoto";
import { emailRegistration } from "../api/FirebaseApi";
import { LinearProgress } from "react-native-elements";

export default function RegistrationPage({ navigation }) {

  const [show, setShow] = useState(false);
  const [checked, setCheck] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      repeat_password: "",
    },
  });


  function setCheckCheckbox() {
    setCheck(!checked);
  }

  const captions = (errors) => {
    return(
      (errors) ? (
          <Text style={{ color: "red", alignSelf: "center" }}>
            {errors.message}
          </Text>
        ):null
    )
  }

  const handleHideShowPassword = () => setShow(!show);


  return (
    <ScrollView>
      <View style={
        {
          width: "80%",
          alignSelf: "center",
        }
      }>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing name." },
            pattern: {value: /\w+\s+\w/, message: 'Name not valid.'}
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={'words'}
              placeholder={"Type your first name and last name"}
              placeholderTextColor="grey"
              status={errors.name ? 'danger' : 'basic'}
              label={'Full name'}
              size={'large'}
              value={value}
              caption={captions(errors.name)}
            />
          )}
          name="name"
        />

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing e-mail." },
            // Check email using RegEx
            pattern: {value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
              , message: 'E-mail not valid.'}
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={'none'}
              placeholder={"Type your e-mail"}
              placeholderTextColor="grey"
              value={value}
              status={errors.email ? 'danger' : 'basic'}
              size={'large'}
              label={'E-Mail'}
              caption={captions(errors.email)}
            />
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: { value: true, message: 'Missing password.'},
            minLength: {value: 6, message: 'Password too short, min 6 characters'}
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              InputRightElement={
                <Icon
                  style={{ paddingRight: 10 }}
                  size={25}
                  color={"black"}
                  name={show ? "visibility-off" : "visibility"}
                  onPress={handleHideShowPassword}
                />
              }
              placeholder={"Password"}
              placeholderTextColor="grey"
              onChangeText={onChange}
              autoCapitalize={'none'}
              value={value}
              secureTextEntry={!show}
              status={errors.password ? 'danger' : 'basic'}
              size={'large'}
              label={'Password'}
              caption={captions(errors.password)}
            />
          )}
          name="password"
        />
        <Controller
          control={control}
          rules={{
            required: { value: true, message: 'Missing password.' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              InputRightElement={
                <Icon
                  style={{ paddingRight: 10 }}
                  size={25}
                  color={"black"}
                  name={show ? "visibility-off" : "visibility"}
                  onPress={handleHideShowPassword}
                />
              }
              placeholder={"Repeat your password"}
              placeholderTextColor="grey"
              onChangeText={onChange}
              autoCapitalize={'none'}
              value={value}
              type={'password'}
              secureTextEntry={!show}
              status={errors.repeat_password ? 'danger' : 'basic'}
              size={'large'}
              label={'Repeat password'}
              caption={captions(errors.repeat_password)}
            />
          )}
          name="repeat_password"
        />

        <CheckBox onChange={setCheckCheckbox} checked={checked}
                  style={styles.checkbox} >I agree with the treep policy</CheckBox>

        <Button disabled={!checked} onPress={handleSubmit((form) => emailRegistration(form, navigation))} >Create profile</Button>

        <LinearProgress value={0.4} variant={'determinate'} />
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
  checkbox: {
  },
  input: {
    color: "black",
    alignSelf: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
});
