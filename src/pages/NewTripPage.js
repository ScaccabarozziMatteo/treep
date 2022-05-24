import { View, StyleSheet, Text, StatusBar, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { VStack } from "native-base";
import { Button, DateTimePicker, TouchableOpacity, Chip } from "react-native-ui-lib";
import { newTrip } from "../api/TripApi";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ModalPhoto from "../utils/ModalPhoto";
import CountryPicker  from 'react-native-country-picker-modal'


export default function NewTripPage({ navigation }) {

  const [places, setPlaces] = useState(null);
  const [activities, setActivities] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [placeError, setPlaceError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


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
      navigation.push("AddActivity", { onCallBack, minDate: getValues("startDate"), maxDate: getValues("endDate"), type: 'new_trip' });
    } else
      setDateError(true);
  }

  const onCallBack = (params) => {
    if (!activities.includes(params))
      setActivities(activity => [...activity, params])
  }

  function chip() {
    return (
    <View style={{ flex: 10 }}>
        {
          activities.map((item, index) => {
            return (
              <View style={{
                margin: 5,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}>
                <Chip
                  key={index}
                  mode="flat" //changing display mode, default is flat.
                  onDismiss={() => setActivities([...activities.slice(0, index), ...activities.slice(index + 1)])}
                  backgroundColor={"white"}
                  labelStyle={{ color: "black" }}
                  useSizeAsMinimum
                  label={item.data.activity_title}
                />
              </View>
            );
          })}
      </View>
    );
  }

  const ref = useRef();

  function clearData() {
    setPlaces(null);
    setActivities([])
    setCoverPhoto(null);
    reset();
  }


  return (
    <ScrollView horizontal={false} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: "white" }}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <VStack style={styles.mainContainer}>

        <CountryPicker modalProps={{animationType: 'slide'}} placeholder={'Click here to choose a country'} containerButtonStyle={styles.countryPicker} withAlphaFilter withCallingCodeButton onSelect={(country => setPlaces(country))} withFilter/>

        {placeError ? (
          <Text style={styles.errorText}>Missing trip country</Text>
        ) : null}

        {places !== null ?
          <Chip
            mode="flat" //changing display mode, default is flat.
            onDismiss={() => setPlaces(null)}
            backgroundColor={"white"}
            labelStyle={{ color: "black" }}
            useSizeAsMinimum
            label={places.name}
          /> : null}
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
                floatingPlaceholderStyle={{ fontFamily: "Barlow", fontSize: 18, top: 35, left: 12 }}
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
              floatingPlaceholderStyle={{ fontFamily: "Barlow", fontSize: 18, top: 35, left: 12 }}
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

        <VStack marginTop={10} alignItems={"center"}>

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

          <Button label={!isLoading ? "Create New Trip" : ""}
                  labelStyle={styles.labelButton}
                  disabled={isLoading}
                  iconSource={!isLoading ? null : () => <ActivityIndicator style={{marginLeft: 20}} color={'white'} size={30}/> }
                  onPress={handleSubmit(async form => {
                    setIsLoading(true)
                    await newTrip(form, places, activities, coverPhoto, navigation);
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
    backgroundColor: "white",
    color: "white",
    width: "100%",
    fontFamily: "Barlow",
    fontSize: 18,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: '#F1F2F5',
    shadowColor: 'rgba(82, 130, 255, 0.5)',
    elevation: 8,
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 1
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
    padding: 17,
    marginBottom: -50,
    zIndex: -1,
    width: "100%",
    fontFamily: "Barlow",
    fontSize: 18,
    alignSelf: "center",
    marginTop: 15,
    backgroundColor: "white",
    color: "black",
    borderWidth: 1,
    borderColor: '#F1F2F5',
    shadowColor: 'rgba(82, 130, 255, 0.5)',
    elevation: 8,
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 1
  },
  coverPhotoButton: {
    backgroundColor: "white",
    width: "100%",
    height: 180,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F2F5',
    shadowColor: 'rgba(82, 130, 255, 0.5)',
    elevation: 8,
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 1
  },
  coverPhotoText: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: 'white',
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
  countryPicker: {
    marginTop: 15,
    backgroundColor: "white",
    width: "100%",
    fontFamily: "Barlow",
    fontSize: 18,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: '#F1F2F5',
    shadowColor: 'rgba(82, 130, 255, 0.5)',
    elevation: 8,
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 1,
    paddingLeft: 10,
    paddingTop: 22,
    paddingBottom: 22,
    marginBottom: 8
  }
});
