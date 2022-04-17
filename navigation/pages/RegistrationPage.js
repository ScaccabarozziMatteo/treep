import { Input, ScrollView, Stack, View } from "native-base";
import React, { useState } from "react";
import { CheckBox, Text } from "@rneui/base";
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import ModalPhoto from "../../utils/ModalPhoto";
import { emailRegistration } from "../../api/FirebaseApi";

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

  function pop() {
    navigation.pop();
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


        <Text
          style={{
            color: "black",
            paddingTop: 30,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}>
          Name
        </Text>
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
              value={value}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text style={{ color: "red", alignSelf: "center" }}>
            {errors.name.message}
          </Text>
        )}


        <Text
          style={{
            color: "black",
            paddingTop: 30,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}>
          E-Mail
        </Text>
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
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={{ color: "red", alignSelf: "center" }}>
            {errors.email.message}
          </Text>
        )}

        <Text
          style={{
            color: "black",
            paddingTop: 30,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}>
          Password
        </Text>
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
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={{ color: "red", alignSelf: "center" }}>
            {errors.password.message}
          </Text>
        )}

        <Text
          style={{
            color: "black",
            paddingTop: 30,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}>
          Repeat password
        </Text>
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
            />
          )}
          name="repeat_password"
        />
        {errors.repeat_password && (
          <Text style={{ color: "red", alignSelf: "center" }}>
            {errors.repeat_password.message}
          </Text>
        )}


        <CheckBox title={"I agree with the treep policy"} onPress={setCheckCheckbox} checked={checked}
                  style={styles.checkbox} />

        <Button title={"Create profile"} disabled={!checked} onPress={handleSubmit((form) => emailRegistration(form, navigation))} />

      </View>

      <ModalPhoto show={showModal} updateShow={(response) => setShowModal(response)} pop={() => pop()}/>

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
    backgroundColor: "red",
  },
  input: {
    color: "black",
    width: "80%",
    alignSelf: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
});
