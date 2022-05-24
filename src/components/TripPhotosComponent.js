import React, { useContext, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-ui-lib";
import { newTrip } from "../api/TripApi";
import { currentUser } from "../api/UserApi";
import { DetailsInfoContext } from "../contexts/DetailsInfoContext";
import ModalPhoto from "../utils/ModalPhoto";

const TripPhotosComponent = (props) => {

  const trip = useContext(DetailsInfoContext).trip;
  const tripID = useContext(DetailsInfoContext).tripID;


  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);


  return(
    <ScrollView style={{backgroundColor: 'white'}}>
      {currentUser().uid === trip.userID ?
      <Button label={!isLoading ? "Add new photo" : ""}
              labelStyle={styles.labelButton}
              disabled={isLoading}
              iconSource={!isLoading ? null : () => <ActivityIndicator style={{marginLeft: 20}} color={'white'} size={30}/> }
              onPress={() => setShowModal(true)}
              style={styles.addPhotoButton} /> : null }

      <ModalPhoto
        typeOfUpload="trip_photo"
        show={showModal}
        updateShow={(response) => setShowModal(response)}
        modalResponse
      />
    </ScrollView>
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
})
