import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Pages import
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import { Icon } from "@rneui/base";
import LoginPage from "../pages/LoginPage";
import AroundMePage from "../pages/AroundMePage";
import NewTripPage from "../pages/NewTripPage.js";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationPage from "../pages/RegistrationPage";
import SearchUsers from "../pages/SearchUsers";
import CompleteRegistrationPage from "../pages/CompleteRegistrationPage";
import { logout } from "../api/UserApi";
import UserProfile from "../pages/UserProfile";
import ChatPage from "../pages/ChatPage";
import { StatusBar } from "react-native";
import ProfilePage from "../pages/ProfilePage";
import MyTrips from "../pages/MyTrips";

// Pages names
const homeName = "Homepage";
const profileName = "Profile";
const exploreName = "Explore";
const newTripName = "New Trip";

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
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerTintColor: "black",
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: "white", shadowColor: "rgba(0,0,0, 0.7)" },
        tabBarActiveTintColor: "#E05D5B",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { fontFamily: "Barlow", paddingBottom: 5, fontSize: 13 },
        tabBarStyle: { height: 60 },
        headerTitleStyle: { fontFamily: "Barlow", fontWeight: "700" },
        headerTitleAlign: "left",
      })}>
      <Tab.Screen name={homeName} options={{title: 'Home'}} component={HomePage} />
      <Tab.Screen options={{
        headerRight: () => <Icon onPress={() => navigation.navigate(SearchUsers)} color={"black"} size={30}
                                 name={"person-search"} />,
      }} name={exploreName} component={ExplorePage} />
      <Tab.Screen name={newTripName} options={{title: 'My Trips'}} component={MyTrips} />
      <Tab.Screen name={profileName} component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default function MainContainer() {
  return (
    <NavigationContainer>
      <StatusBar/>
      <Stack.Navigator screenOptions={() => ({
        presentation: 'modal',
        headerTintColor: "black",
        headerStyle: { backgroundColor: "white" },
        tabBarActiveTintColor: "#191d3a",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { paddingBottom: 5, fontSize: 13 },
        tabBarStyle: { height: 60 },
        headerTitleAlign: "center",
      })
      }>
        <Stack.Screen
          name="Tab"
          component={TabContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" options={({ navigation }) => ({
          title: "Sign In",
          headerTintColor: 'white',
          headerStyle: { backgroundColor: "#3F799D", shadowColor: '#3F799D', height: 100 },
          headerTitleStyle: { color: "white", fontFamily: "Barlow", fontSize: 30, fontWeight: "bold" },
          headerLeft: () => <Icon size={28} name={"arrow-back"} style={{padding: 10}} color={"white"} onPress={() => {
            navigation.navigate("Homepage");
          }} />,
        })} component={LoginPage} />
        <Stack.Screen name="Registration" options={{
          title: "Sign Up",
          headerTintColor: 'white',
          headerStyle: { backgroundColor: "#3F799D", shadowColor: '#3F799D', height: 100 },
          headerTitleStyle: { color: "white", fontFamily: "Barlow", fontSize: 30, fontWeight: "bold" },
        }} component={RegistrationPage} />
        <Stack.Screen name="AroundMe" options={{ title: "Around Me" }} component={AroundMePage} />
        <Stack.Screen name="NewTrips" options={{ title: "New Trip" }} component={NewTripPage} />
        <Stack.Screen name="ChatPage" component={ChatPage}
                      options={({ route }) => ({ headerTitle: route.params.titlePage })}
        />
        <Stack.Screen name="CompleteRegistrationPage" options={({ navigation }) => ({
          title: "Complete Registration",
          animationEnabled: true,
          headerStyle: { backgroundColor: "#3F799D", shadowColor: '#3F799D', height: 100 },
          headerTitleStyle: { color: "white", fontFamily: "Barlow", fontSize: 30, fontWeight: "bold" },
          headerLeft: () => <Icon size={28} name={"arrow-back"} style={{paddingLeft: 10}} color={"white"} onPress={() => {
            logout();
            navigation.navigate("Profile");
          }} />,
        })} component={CompleteRegistrationPage} />
        <Stack.Screen name="SearchUsers" options={{ title: "Search Users", animationEnabled: false }}
                      component={SearchUsers} />
        <Stack.Screen name="UserProfile" options={{ title: "Searched User", animationEnabled: true }}
                      component={UserProfile} />
        <Stack.Screen
          name="NewTripPage"
          options={{title: 'New Trip', animationEnabled: false}}
          component={NewTripPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
