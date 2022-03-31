import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from "react-native";

export default function HomePage() {
    return (
        <View>
            <SafeAreaView style={styles.container}>
                <View>
                    <Text>This is the home Page</Text>
                </View>

            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
    },

});
