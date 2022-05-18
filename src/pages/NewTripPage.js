import { View, StyleSheet, Text, StatusBar, ScrollView, Image, Alert } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { VStack } from "native-base";
import { Button, DateTimePicker, TouchableOpacity, Chip } from "react-native-ui-lib";
import { newTrip } from "../api/TripApi";
import { TextInput } from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ModalPhoto from "../utils/ModalPhoto";

export default function NewTripPage({ navigation }) {

  const [places, setPlaces] = useState([]);
  const [activities, setActivities] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [placeError, setPlaceError] = useState(false);


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

  function addActivityPage() {
    if (getValues("startDate") !== undefined && getValues("endDate") !== undefined) {
      setDateError(false);
      navigation.push("AddActivity", { onCallBack, minDate: getValues("startDate"), maxDate: getValues("endDate") });
    } else
      setDateError(true);
  }

  const onCallBack = (params) => {
    if (!activities.includes(params))
      setActivities(activity => [...activity, params])
  }

  function chip(input, setInput) {
    return (
    <View style={{ flex: 10 }}>
        {
          input.map((item, index) => {
            return (
              <View style={{
                margin: 5,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}>
                <Chip
                  key={item.place_id}
                  mode="flat" //changing display mode, default is flat.
                  onDismiss={() => setInput([...input.slice(0, index), ...input.slice(index + 1)])}
                  backgroundColor={"white"}
                  labelStyle={{ color: "black" }}
                  useSizeAsMinimum
                  label={input === places ? item.description : item.data.title}
                />
              </View>
            );
          })}
      </View>
    );
  }

  const ref = useRef();

  function clearData() {
    setPlaces([]);
    setCoverPhoto(null);
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
              placeholder="Where will your trip take place?"
              textInputProps={{
                placeholderTextColor: "#938E8E",
                returnKeyType: "search",
              }} nearbyPlacesAPI={"GoogleReverseGeocoding"}
              onPress={(data, details = null) => {
                // Check if an element is already added
                if (!places.includes(data))
                  setPlaces(places => [...places, data]);
              }}
              query={{
                key: "AIzaSyBmBppizINlbWovLovBSm3KT4lElW5lt5g",
                language: "en",
              }}
            />
          </View>
        </ScrollView>

        {placeError ? (
          <Text style={styles.errorText}>Missing activity place</Text>
        ) : null}

        {chip(places, setPlaces)}

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing trip title" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              label={"Title"}
              underlineColor={"transparent"}
              activeUnderlineColor={"#3F799D"}
              value={value}
              theme={{ colors: { placeholder: "#938E8E", text: "black" } }}
            />
          )}
          name="title"
        />
        {captions(errors.title)}


        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing trip description" },
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

        <VStack alignItems={"center"} style={{ marginBottom: -25 }}>
          <TouchableOpacity
            onPress={() => {
              setShowModal(true);
            }}
            style={styles.coverPhotoButton}>
            <Image resizeMode={"center"} style={{ height: "100%" }}
                   source={coverPhoto !== null ? { uri: coverPhoto.assets[0].uri } : null} />
            <Text style={styles.coverPhotoText}>Choose cover photo</Text>
          </TouchableOpacity>
        </VStack>

        <VStack marginTop={45}>
          <Controller
            control={control}
            rules={{
              required: { value: true, message: "Missing trip start date" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DateTimePicker
                theme={{ colors: { placeholder: "#938E8E", text: "black" } }}
                placeholderTextColor={"#938E8E"}
                floatingPlaceholderColor={"#938E8E"}
                floatingPlaceholderStyle={{ fontFamily: "Barlow", fontSize: 18 }}
                value={value}
                maximumDate={getValues("endDate")}
                underlineColor={"transparent"}
                floatingPlaceholder
                style={styles.pickerText}
                placeholder="Start-date"
                onBlur={onBlur}
                required
                onChange={date => {
                  setValue("startDate", date);
                  clearErrors("startDate");
                }}
              />
            )}
            name="startDate"
          />
          {captions(errors.startDate)}
        </VStack>

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Missing trip end date" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateTimePicker
              theme={{ colors: { placeholder: "#BEC2C2", text: "white" } }}
              placeholderTextColor={"#938E8E"}
              floatingPlaceholderColor={"#938E8E"}
              floatingPlaceholderStyle={{ fontFamily: "Barlow", fontSize: 18 }}
              value={value}
              minimumDate={getValues("startDate")}
              underlineColor={"transparent"}
              floatingPlaceholder
              style={styles.pickerText}
              placeholder="End-date"
              onBlur={onBlur}
              required
              onChange={date => {
                setValue("endDate", date);
                clearErrors("endDate");
              }}
            />
          )}
          name="endDate"
        />
        {captions(errors.endDate)}

        <VStack alignItems={"center"}>

          <Button label={"Add activity"}
                  iconSource={() => <Icon style={styles.labelActivityButton} size={20} name={"plus"} />}
                  iconOnRight={false}
                  disabled={""}
                  labelStyle={styles.labelActivityButton}
                  onPress={addActivityPage}
                  style={styles.addActivityButton} />

          {chip(activities, setActivities)}

          {dateError ? (
            <Text style={styles.errorText}>Please, select dates before add activities</Text>
          ) : null}

          <Button label={"Create New Trip"}
                  labelStyle={styles.labelButton}
                  onPress={handleSubmit(async form => {
                    await newTrip(form);
                  })}
                  style={styles.createButton} />

        </VStack>
        <VStack alignItems={"center"} style={{ marginTop: -10 }}>
          <Button label={"Clear data"}
                  labelStyle={styles.labelButton}
                  onPress={clearData}
                  style={styles.wipeButton} />
        </VStack>
        <ModalPhoto typeOfUpload="newTrip_cover" show={showModal} updateImage={(response) => setCoverPhoto(response)}
                    updateShow={(response) => setShowModal(response)} modalResponse />
      </VStack>
    </ScrollView>

  );
}

export const styles = StyleSheet.create({
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
    fontFamily: "Barlow",
  },
  createButton: {
    backgroundColor: "#3F799D",
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
    backgroundColor: "#938E8E",
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
    color: "#F1F2F5",
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
