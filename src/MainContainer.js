import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Pages import
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import { Icon } from "@rneui/base";
import { StatusBar } from "react-native";
import LoginPage from "./pages/LoginPage";
import AroundMePage from "./pages/AroundMePage";
import NewTripPage from "./pages/NewTripPage.js";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationPage from "./pages/RegistrationPage";
import SearchUsers from "./pages/SearchUsers";

// Pages names
const homeName = "Home";
const profileName = "Profile";
const exploreName = "Explore";
const newTripName = "New Trip";
const aroundMeName = "Around Me";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabContainer({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let routeName = route.name;

          switch (routeName) {
            case homeName:
              iconName = focused ? "home" : "home";
              break;
            case profileName:
              iconName = focused ? "person" : "person";
              break;
            case exploreName:
              iconName = focused ? "explore" : "explore";
              break;
            case newTripName:
              iconName = focused ? "add" : "add";
              break;
            case aroundMeName:
              iconName = focused ? "people" : "people";
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#191d3a" },
        tabBarActiveTintColor: "#191d3a",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { paddingBottom: 5, fontSize: 13 },
        tabBarStyle: { height: 60 },
        headerTitleAlign: "center",
      })}>
      <Tab.Screen name={homeName} component={HomePage} />
      <Tab.Screen options={{headerRight: () => <Icon onPress={() => navigation.navigate(SearchUsers)} color={'white'} size={30} name={"person-search"}/>}} name={exploreName} component={ExplorePage} />
      <Tab.Screen options={{headerRight: () => <Icon onPress={() => null} color={'white'} size={30} name={"settings"}/>}} name={profileName} component={LoginPage} />
      <Tab.Screen name={newTripName} component={NewTripPage} />
      <Tab.Screen name={aroundMeName} component={AroundMePage} />
    </Tab.Navigator>
  );
}

export default function MainContainer() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={"#191d3a"} />
      <Stack.Navigator screenOptions={() => ({
        presentation: 'modal',
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#191d3a" },
        tabBarActiveTintColor: "#191d3a",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { paddingBottom: 5, fontSize: 13 },
        tabBarStyle: { height: 60 },
        headerTitleAlign: "center",
      })
      }>
        <Stack.Screen
          name= 'Tab'
          component={TabContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Registration' component={RegistrationPage}/>
        <Stack.Screen name='SearchUsers' options={{title: 'Search Users', animationEnabled: false}} component={SearchUsers}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
