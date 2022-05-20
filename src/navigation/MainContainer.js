import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Pages import
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
import AddActivityPage from "../pages/AddActivityPage";
import MyTripsPage from "../pages/MyTripsPage";
import TripDetailsPage from "../pages/TripDetailsPage";
import ConversationsPage from "../pages/ConversationsPage";
import Following_Following_Page from "../pages/Following_Following_Page";

// Pages names
const homeName = "Homepage";
const profileName = "Profile";
const exploreName = "Explore";
const newTripName = "New Trip";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function homepageRightButton(navigation) {
  return(
    <Icon onPress={() => navigation.navigate('Conversations')} style={{marginRight: 10}} color={"black"} size={30}
          name={"bell-outline"} />
  )
}


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
            case exploreName:
              iconName = focused ? "compass-outline" : "compass-outline";
              break;
            case newTripName:
              iconName = focused ? "map-outline" : "map-outline";
              break;
            case profileName:
              iconName = focused ? "account-circle-outline" : "account-circle-outline";
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
      <Tab.Screen name={homeName} options={{title: 'Home', headerRight: () => homepageRightButton(navigation)}} component={HomePage} />
      <Tab.Screen options={{
        headerRight: () => <Icon onPress={() => navigation.navigate({name: 'SearchUsers', params: { title: "Search users", typeSearch: "searchUsers" }})} style={{marginRight: 10}} color={"black"} size={30}
                                 name={"account-search"} />,
      }} name={exploreName} component={ExplorePage} />
      <Tab.Screen name={newTripName} options={{title: 'My Trips'}} component={MyTripsPage} />
      <Tab.Screen name={profileName} component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={() => ({
        presentation: 'card',
        headerTintColor: "black",
        headerStyle: { backgroundColor: "white", shadowColor: "rgba(0,0,0, 0.7)" },
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
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen name="Login" options={({ navigation }) => ({
          title: "Sign In",
          presentation: 'card',
          headerTintColor: 'white',
          headerStyle: { backgroundColor: "#3F799D", shadowColor: '#3F799D', height: 100 },
          headerTitleStyle: { color: "white", fontFamily: "Barlow", fontSize: 30, fontWeight: "bold" },
          headerLeft: () => <Icon size={28} name={"arrow-left"} style={{padding: 10}} color={"white"} onPress={() => {
            navigation.navigate("Homepage");
          }} />,
        })} component={LoginPage} />
        <Stack.Screen name="Registration" options={{
          title: "Sign Up",
          presentation: 'card',
          headerTintColor: 'white',
          headerStyle: { backgroundColor: "#3F799D", shadowColor: '#3F799D', height: 100 },
          headerTitleStyle: { color: "white", fontFamily: "Barlow", fontSize: 30, fontWeight: "bold" },
        }} component={RegistrationPage} />
        <Stack.Screen name="AroundMe" options={{ title: "Around Me", presentation: 'card', headerTitleAlign: 'left', headerTitleStyle: { fontFamily: "Barlow", fontWeight: "bold" }, }} component={AroundMePage} />
        <Stack.Screen name="NewTrips" options={{ title: "New Trip", presentation: 'card', headerTitleAlign: 'left', headerTitleStyle: { fontFamily: "Barlow", fontWeight: "bold" }, }} component={NewTripPage} />
        <Stack.Screen name="Conversations" options={{ title: "Conversations", presentation: 'card', headerTitleAlign: 'left', headerTitleStyle: { fontFamily: "Barlow", fontWeight: "bold" }, }} component={ConversationsPage} />
        <Stack.Screen name="ChatPage" component={ChatPage}
                      options={({ route }) => ({ headerTitle: route.params.titlePage, presentation: 'card', })}
        />
        <Stack.Screen name="CompleteRegistrationPage" options={({ navigation }) => ({
          title: "Complete Registration",
          presentation: 'card',
          animationEnabled: true,
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: "#3F799D", shadowColor: '#3F799D', height: 100 },
          headerTitleStyle: { color: "white", fontFamily: "Barlow", fontSize: 30, fontWeight: "bold" },
          headerLeft: () => <Icon size={28} name={"arrow-left"} style={{paddingLeft: 10}} color={"white"} onPress={async () => {
            await logout();
          }} />,
        })} component={CompleteRegistrationPage} />
        <Stack.Screen name="UserProfile" options={{ title: "User Profile", presentation: 'card', headerTitleAlign: 'left', headerTitleStyle: { fontFamily: "Barlow", fontWeight: "bold" }, animationEnabled: false }}
                      component={UserProfile} />
        <Stack.Screen name="SearchUsers" options={({ route }) => ({ title: route.params.title, presentation: 'card', headerTitleAlign: 'left', headerTitleStyle: { fontFamily: "Barlow", fontWeight: "bold" }, animationEnabled: true })}
                      component={SearchUsers} />
        <Stack.Screen name="AddActivity" options={{ title: "Activity", presentation: 'card', headerTitleAlign: 'left', headerTitleStyle: { fontFamily: "Barlow", fontWeight: "bold" }, animationEnabled: true }}
                      component={AddActivityPage} />
        <Stack.Screen name="Follow" options={({ route }) => ({ title: route.params.title, presentation: 'card', headerTitleAlign: 'left', headerTitleStyle: { fontFamily: "Barlow", fontWeight: "bold" }, animationEnabled: true })}
                      component={Following_Following_Page} />
        <Stack.Screen
          name="NewTripPage"
          options={{title: 'New Trip', headerTitleAlign: 'left', presentation: 'card', headerTitleStyle: { fontFamily: "Barlow", fontWeight: "bold" }, animationEnabled: false}}
          component={NewTripPage}
        />
        <Stack.Screen name="TripDetailsPage"
                      options={{title: '', presentation: 'card', animationEnabled: false, headerShown: false}}
                      component={TripDetailsPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
