/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import MainContainer from "./src/MainContainer";
import type { Node } from "react";
import * as eva from "@eva-design/eva";
import Toast from "react-native-toast-message";

import { StyleSheet, useColorScheme } from "react-native";

// Important!! It needs in order to keep Native base working
import { NativeBaseProvider } from "native-base/src/core/NativeBaseProvider";
import { ApplicationProvider } from "@ui-kitten/components";

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === "light";

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NativeBaseProvider>
        <MainContainer />
        <Toast />
      </NativeBaseProvider>
    </ApplicationProvider>

  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
