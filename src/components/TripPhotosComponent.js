import React, { useContext, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-ui-lib";
import { newTrip } from "../api/TripApi";
import { currentUser } from "../api/UserApi";
import { DetailsInfoContext } from "../contexts/DetailsInfoContext";
import ModalPhoto from "../utils/ModalPhoto";
import ImageView from 'react-native-image-viewing';
import { Image } from "native-base";


const TripPhotosComponent = (props) => {

  const trip = useContext(DetailsInfoContext).trip;
  const tripID = useContext(DetailsInfoContext).tripID;


  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [index, setIndex] = useState();


  console.log(trip.photos)

  return(
    <FlatList style={{backgroundColor: 'white'}} numColumns='2'>
      {currentUser().uid === trip.userID ?
      <Button label={!isLoading ? "Add new photo" : ""}
              labelStyle={styles.labelButton}
              disabled={isLoading}
              iconSource={!isLoading ? null : () => <ActivityIndicator style={{marginLeft: 20}} color={'white'} size={30}/> }
              onPress={() => setShowModal(true)}
              style={styles.addPhotoButton} /> : null }

      <View style={{marginBottom: 50}}>
        {trip.photos !== undefined ? trip.photos.map((image, index) => (
          <TouchableOpacity
            key={image.uri}
            style={{height: 200}}
            onPress={() => {
              setIndex(index)
              setIsVisible(true)
            }}
          >
            <Image
              style={styles.imageStyle}
              source={{uri: image.uri}}
              resizeMode="contain"
              alt={'photo'}
            />
          </TouchableOpacity>
        )) : null}
      </View>

      <ImageView
      images={trip.photos}
      imageIndex={index}
      visible={visible}
      onRequestClose={() => setIsVisible(false)}
      animationType={'fade'}/>

      <ModalPhoto
        typeOfUpload="trip_photo"
        tripID={tripID}
        show={showModal}
        updateShow={(response) => setShowModal(response)}
        modalResponse
      />
    </FlatList>
  )
}

export default TripPhotosComponent;

const styles = StyleSheet.create({
  addPhotoButton: {
    backgroundColor: "#3F799D",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0)",
    marginTop: 18,
    marginBottom: 18,
    height: 45,
    width: "80%",
    alignSelf: 'center'
  },
  imageStyle: {
    height: 200,
    margin: "3%",
    shadowColor: "rgba(82, 130, 255, 0.5)",
    elevation: 8,
    borderRadius: 16,
  }
})
