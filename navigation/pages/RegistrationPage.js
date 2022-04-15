import { Input, View } from "native-base";
import React, { useState } from "react";
import { CheckBox, Text } from "@rneui/base";
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";

export default function RegistrationPage() {

  const [show, setShow] = useState(false);
  const [checked, setCheck] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });


  function setCheckCheckbox() {
    setCheck(!checked)
  }
  const handleHideShowPassword = () => setShow(!show);


  return (
    <View style={
      {
        width: '80%',
        alignSelf: 'center'
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
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={"Type your first name and last name"}
            placeholderTextColor="grey"
            value={value}
          />
        )}
        name="email"
      />
      {errors.email && (
        <Text style={{ color: "red", alignSelf: "center" }}>
          This is required.
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
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={"Type your e-mail"}
            placeholderTextColor="grey"
            value={value}
          />
        )}
        name="email"
      />
      {errors.email && (
        <Text style={{ color: "red", alignSelf: "center" }}>
          This is required.
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
          required: true,
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
            value={value}
            secureTextEntry={!show}
          />
        )}
        name="password"
      />

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
          required: true,
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
            value={value}
            secureTextEntry={!show}
          />
        )}
        name="repeat-password"
      />




      <CheckBox title={'I agree with the treep policy'} onPress={setCheckCheckbox} checked={checked} style={styles.checkbox} />

    </View>
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
    backgroundColor: 'red'
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
