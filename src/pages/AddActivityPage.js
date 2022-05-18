import React, {useRef, useState} from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Text } from "@rneui/base";
import { VStack } from "native-base";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native-paper";
import { Button, Chip, DateTimePicker } from "react-native-ui-lib";
import { newTrip } from "../api/TripApi";

export default function AddActivityPage(props) {

  const [places, setPlaces] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  const captions = errors => {
    return errors ? (
      <Text style={styles.errorText}>{errors.message}</Text>
    ) : null;
  };

  const ref = useRef();

  function clearData() {
    reset();
  }

  return (
    <ScrollView horizontal={false} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: "white" }}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <VStack style={styles.mainContainer}>

        <ScrollView horizontal={true} keyboardShouldPersistTaps={"handled"}>
          <View style={{ minWidth: 350, maxWidth: 350 }}>
            <GooglePlacesAutocomplete
              ref={ref}
              enableHighAccuracyLocation
              enablePoweredByContainer={false}
              renderRightButton={() => <Icon name={"close"} onPress={() => {
                ref.current.clear();
                ref.current.blur();
              }} style={{ marginTop: 15 }} size={30} color={"black"} />}
              styles={{
                listView: {
                  backgroundColor: "grey",
                },
                predefinedPlacesDescription: {
                  color: "red",
                },
                textInput: {
                  color: "black",
                  fontSize: 18,
                  height: 60,
                  fontFamily: "Barlow",
                  backgroundColor: "#F1F2F5",
                  borderRadius: 4,
                },
                description: {
                  color: "black",
                },
                row: {},
              }}
              placeholder="Where will your activity take place?"
              textInputProps={{
                placeholderTextColor: "#938E8E",
                returnKeyType: "search",
              }} nearbyPlacesAPI={"GoogleReverseGeocoding"}
              onPress={(data, details = null) => {
                // Check if an element is already added
                  setPlaces(data)
              }}
              query={{
                key: "AIzaSyBmBppizINlbWovLovBSm3KT4lElW5lt5g",
                language: "en",
              }}
            />
          </View>
        </ScrollView>

        {places !== null ?
        <Chip
          mode="flat" //changing display mode, default is flat.
          onDismiss={() => setPlaces(null)}
          backgroundColor={"white"}
          labelStyle={{ color: "black" }}
          useSizeAsMinimum
          label={places.description}
        /> : null}

        <VStack marginTop={0}>
          <Controller
            control={control}
            rules={{
              required: { value: true, message: "Missing activity date" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DateTimePicker
                theme={{ colors: { placeholder: "#938E8E", text: "black" } }}
                placeholderTextColor={"#938E8E"}
                floatingPlaceholderColor={"#938E8E"}
                floatingPlaceholderStyle={{ fontFamily: "Barlow", fontSize: 18 }}
                value={value}
                underlineColor={"transparent"}
                floatingPlaceholder
                style={styles.pickerText}
                placeholder="Date"
                onBlur={onBlur}
                required
                onChange={date => {
                  setValue("date", date);
                  clearErrors("date");
                }}
              />
            )}
            name="date"
          />
          {captions(errors.date)}
        </VStack>


        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing activity name" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              label={"Name of the activity"}
              underlineColor={"transparent"}
              activeUnderlineColor={"#3F799D"}
              value={value}
              theme={{ colors: { placeholder: "#938E8E", text: "black" } }}
            />
          )}
          name="activity_title"
        />
        {captions(errors.activity_title)}


        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing activity description" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              multiline
              onChangeText={onChange}
              label={"Description"}
              underlineColor={"transparent"}
              activeUnderlineColor={"#3F799D"}
              value={value}
              theme={{ colors: { placeholder: "#938E8E", text: "black" } }}
            />
          )}
          name="description"
        />
        {captions(errors.description)}


        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              label={"Link for booking activity"}
              underlineColor={"transparent"}
              activeUnderlineColor={"#3F799D"}
              value={value}
              theme={{ colors: { placeholder: "#938E8E", text: "black" } }}
            />
          )}
          name="link"
        />
        {captions(errors.link)}

        <VStack alignItems={"center"}>

          <Button label={"Add Activity"}
                  labelStyle={styles.labelButton}
                  onPress={handleSubmit(form => {
                    props.updateActivity(form);
                  })}
                  style={styles.createButton} />

        </VStack>
        <VStack alignItems={"center"} style={{ marginTop: -10 }}>
          <Button label={"Clear data"}
                  labelStyle={styles.labelButton}
                  onPress={clearData}
                  style={styles.wipeButton} />
        </VStack>
      </VStack>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  text2: {
    fontSize: 18,
    fontWeight: "bold",
    alignContent: "center",
    color: "black",
  },
  mainContainer: {
    width: "85%",
    alignSelf: "center",
    backgroundColor: "white",
    marginTop: 18,
  },
  boxButton: {
    paddingTop: 18,
    width: "40%",
    alignSelf: "center",
  },
  checkbox: {},
  input: {
    marginTop: 15,
    backgroundColor: "#F1F2F5",
    color: "white",
    width: "100%",
    fontFamily: "Barlow",
    fontSize: 18,
    alignSelf: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#2B5B54",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 18,
    marginBottom: 18,
    height: 50,
    width: "100%",
  },
  wipeButton: {
    backgroundColor: "#E05D5B",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 18,
    marginBottom: 18,
    height: 50,
    width: "100%",
  },
  addActivityButton: {
    backgroundColor: "#F1F2F5",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 18,
    marginBottom: 18,
    height: 50,
    width: "100%",
  },
  labelActivityButton: {
    fontFamily: "Barlow",
    fontWeight: "700",
    fontSize: 18,
    color: '#938E8E'
  },
  labelButton: {
    fontFamily: "Barlow",
    fontWeight: "700",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    alignSelf: "center",
    fontFamily: "Barlow",
  },
  pickerText: {
    padding: 15,
    color: "black",
    marginBottom: -35,
    zIndex: -1,
    borderRadius: 4,
    backgroundColor: "#F1F2F5",
    width: "100%",
    fontFamily: "Barlow",
    fontSize: 18,
    alignSelf: "center",
  },
  coverPhotoButton: {
    backgroundColor: "#F1F2F5",
    width: "100%",
    height: 180,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 20,
  },
  coverPhotoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D253C",
    marginTop: 0,
    marginLeft: "0%",
    borderColor: "#807F7F",
    borderRadius: 30,
    marginRight: 4,
    borderWidth: 1,
    padding: 10,
    lineHeight: 22,
    fontFamily: "Barlow",
    textAlign: "center",
  },
});

