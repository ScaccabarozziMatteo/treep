import { View } from "react-native";
import { Text } from "@rneui/base";
import React from 'react';


export default function RegistrationPage(props) {


  return(
    <View>
      <Text onPress={() => props.setRegistration(false)}>Go back</Text>
    </View>
  )
}
