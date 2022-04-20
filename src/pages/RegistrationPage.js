import { ScrollView, Stack, View } from "native-base";
import React, { useState } from "react";
import { Input, CheckBox, Button, Datepicker } from "@ui-kitten/components";
import { Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";
import { emailRegistration } from "../api/FirebaseApi";
import { LinearProgress } from "react-native-elements";
import { Select, SelectItem } from "@ui-kitten/components";
import { Text } from "react-native";


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
      birthdate: ""
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

  function firstModule() {
    return (
      <View>
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

        <Stack direction={"row"} style={{ width: "100%"}}>
          <Button disabled style={{ width: "30%", marginRight: '40%'  }}>
            Back
          </Button>
          <Button style={{ width: "30%"}} onPress={() => {
            setStatus(status + 1);
            setProgress(1);
          }}>
            Next
          </Button>
        </Stack>
      </View>
    );
  }

  function secondModule() {
    return (
      <View>

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
            <Input
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize={"none"}
              placeholder={"E-mail"}
              placeholderTextColor="grey"
              value={value}
              status={errors.email ? "danger" : "basic"}
              size={"large"}
              label={"E-mail"}
              caption={captions(errors.email)}
            />
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing password." },
            minLength: { value: 6, message: "Password too short, min 6 characters" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              accessoryRight={
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
              autoCapitalize={"none"}
              value={value}
              secureTextEntry={!show}
              status={errors.password ? "danger" : "basic"}
              size={"large"}
              label={"Password"}
              caption={captions(errors.password)}
            />
          )}
          name="password"
        />
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing password." },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              accessoryRight={
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
              autoCapitalize={"none"}
              value={value}
              type={"password"}
              secureTextEntry={!show}
              status={errors.repeat_password ? "danger" : "basic"}
              size={"large"}
              label={"Repeat password"}
              caption={captions(errors.repeat_password)}
            />
          )}
          name="repeat_password"
        />

        <CheckBox onChange={setCheckCheckbox} checked={checked}
                  style={styles.checkbox}>I agree with the treep policy</CheckBox>


        <Stack direction={"row"} style={{ width: "100%"}}>
          <Button style={{ width: "30%", marginRight: '30%' }} onPress={() => {
            setStatus(status - 1);
            setProgress(0.5);
          }}>
            Back
          </Button>
          <Button disabled={!checked} status={'success'} style={{ width: "40%"}} onPress={handleSubmit((form) => emailRegistration(form, navigation))}>
            Create profile
          </Button>
        </Stack>


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
    <ScrollView>
      <View style={
        {
          width: "80%",
          alignSelf: "center",
        }
      }>

        {status === 0 ? firstModule() : null}
        {status === 1 ? secondModule() : null}

        <LinearProgress value={progress} variant={"determinate"} />
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
