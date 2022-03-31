import React from "react";


import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


//Pages import
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import { Icon, Text } from "@rneui/base";
import { StatusBar } from "react-native";

// Pages names
const homeName = "Treep";
const profileName = "Profile";
const exploreName = "Explore";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={"#191d3a"} />
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let routeName = route.name;

            if (routeName === homeName) {
              iconName = focused ? "home" : "home";
            } else if (routeName === profileName) {
              iconName = focused ? "person" : "person";
            } else if (routeName === exploreName) {
              iconName = focused ? "explore" : "explore";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#191d3a" },
          tabBarActiveTintColor: "#191d3a",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: { paddingBottom: 5, fontSize: 13 },
          tabBarStyle: { height: 60 },
          headerTitleAlign: 'center',
          headerLeft: () => <Text style={{fontSize: 18, color: 'white'}}>Left</Text>,
          headerRight: () => <Text style={{fontSize: 18, color: 'white'}}>Right</Text>
        })}
      >

        <Tab.Screen name={homeName} component={HomePage} />
        <Tab.Screen name={exploreName} component={ExplorePage} />
        <Tab.Screen name={profileName} component={ProfilePage} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
