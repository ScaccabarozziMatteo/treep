// Here we can build the top navigation, creating all the cases

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Icon, Avatar } from "react-native-elements";

export default function TopBar() {
    return (
      <View style={styles.container}>
          <Text>     </Text>
          <Text style={TreepStyle}>Treep </Text>
          <Avatar
            size={25}
            activeOpacity={100}
            rounded
            source={null}
            onPress={null}
          >
              <Icon name='person' />
          </Avatar>
      </View>
    );
}

const TreepStyle = {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        height: 55,
        flexDirection: 'row', // row
        color: 'black',
        backgroundColor: '#C2185B',
        alignItems: 'center',
        justifyContent: 'space-between', // center, space-around
        paddingLeft: 10,
        paddingRight: 10,
    },
});
