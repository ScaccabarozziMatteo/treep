import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Pages import
import HomePage from "../pages/HomePage";
import { useNavigation } from "@react-navigation/native";
import ExplorePage from "../pages/ExplorePage";
import { Icon } from "@rneui/base";
import { StatusBar } from "react-native";
import LoginPage from "../pages/LoginPage";
import AroundMePage from "../pages/AroundMePage";
import NewTripPage from "../pages/NewTripPage.js";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationPage from "../pages/RegistrationPage";
import SearchUsers from "../pages/SearchUsers";
import CompleteRegistrationPage from "../pages/CompleteRegistrationPage";
import { currentUser, logout } from "../api/UserApi";
import UserProfile from "../pages/UserProfile";

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
        headerTintColor: "black",
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: "white", shadowColor: "rgba(0,0,0, 0.7)" },
        tabBarActiveTintColor: "#6540F5",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { fontFamily: "Barlow", paddingBottom: 5, fontSize: 13 },
        tabBarStyle: { height: 60 },
        headerTitleStyle: { fontFamily: "Barlow" },
        headerTitleAlign: "left",
      })}>
      <Tab.Screen name={homeName} component={HomePage} />
      <Tab.Screen options={{
        headerRight: () => <Icon onPress={() => navigation.navigate(SearchUsers)} color={"black"} size={30}
                                 name={"person-search"} />,
      }} name={exploreName} component={ExplorePage} />
      <Tab.Screen name={newTripName} component={NewTripPage} />
      <Tab.Screen name={aroundMeName} component={AroundMePage} />
      <Tab.Screen options={{ headerShown: false }} name={profileName} component={LoginPage} />
    </Tab.Navigator>
  );
}

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={() => ({
        presentation: "modal",
        headerTintColor: "black",
        headerStyle: { backgroundColor: "white", shadowColor: "rgba(0,0,0, 0.7)" },
        tabBarActiveTintColor: "#191d3a",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { fontFamily: "Barlow", paddingBottom: 5, fontSize: 13 },
        tabBarStyle: { height: 60 },
        headerTitleStyle: { fontFamily: "Barlow", fontWeight: "600" },
        headerTitleAlign: "left",
      })
      }>
        <Stack.Screen
          name="Tab"
          component={TabContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Registration" component={RegistrationPage} />
        <Stack.Screen name="CompleteRegistrationPage" options={({ navigation }) => ({
          title: "Complete Registration",
          animationEnabled: true,
          headerLeft: () => <Icon size={28} name={"arrow-back"} color={"white"} onPress={() => {
            logout();
            navigation.navigate("Profile");
          }} />,
        })} component={CompleteRegistrationPage} />
        <Stack.Screen name="SearchUsers" options={{ title: "Search Users", animationEnabled: false }}
                      component={SearchUsers} />
        <Stack.Screen name="UserProfile" options={{ title: "Searched User", animationEnabled: true }}
                      component={UserProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
