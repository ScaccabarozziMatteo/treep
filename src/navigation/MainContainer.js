import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//Pages import
import HomePage from '../pages/HomePage';
import {useNavigation} from '@react-navigation/native';
import ExplorePage from '../pages/ExplorePage';
import {Icon} from '@rneui/base';
import {StatusBar} from 'react-native';
import LoginPage from '../pages/LoginPage';
import AroundMePage from '../pages/AroundMePage';
import MyTripsPage from '../pages/MyTripsPage.js';
import {createStackNavigator} from '@react-navigation/stack';
import RegistrationPage from '../pages/RegistrationPage';
import SearchUsers from '../pages/SearchUsers';
import CompleteRegistrationPage from '../pages/CompleteRegistrationPage';
import {logout} from '../api/UserApi';
import UserProfile from '../pages/UserProfile';
import NewTripPage from '../pages/NewTripPage';

// Pages names
const homeName = 'Home';
const profileName = 'Profile';
const exploreName = 'Explore';
const tripsName = 'Trips';
const aroundMeName = 'Around Me';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabContainer({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let routeName = route.name;

          switch (routeName) {
            case homeName:
              iconName = focused ? 'home' : 'home';
              break;
            case profileName:
              iconName = focused ? 'person' : 'person';
              break;
            case exploreName:
              iconName = focused ? 'explore' : 'explore';
              break;
            case tripsName:
              iconName = focused ? 'add' : 'add';
              break;
            case aroundMeName:
              iconName = focused ? 'people' : 'people';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerTintColor: 'white',
        headerStyle: {backgroundColor: '#191d3a'},
        tabBarActiveTintColor: '#191d3a',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {paddingBottom: 5, fontSize: 13},
        tabBarStyle: {height: 60},
        headerTitleAlign: 'center',
      })}>
      <Tab.Screen name={homeName} component={HomePage} />
      <Tab.Screen
        options={{
          headerRight: () => (
            <Icon
              onPress={() => navigation.navigate(SearchUsers)}
              color={'white'}
              size={30}
              name={'person-search'}
            />
          ),
        }}
        name={exploreName}
        component={ExplorePage}
      />
      <Tab.Screen
        options={{
          headerRight: () => (
            <Icon
              onPress={() => null}
              color={'white'}
              size={30}
              name={'settings'}
            />
          ),
        }}
        name={profileName}
        component={LoginPage}
      />
      <Tab.Screen name={tripsName} component={MyTripsPage} />
      <Tab.Screen name={aroundMeName} component={AroundMePage} />
    </Tab.Navigator>
  );
}

export default function MainContainer() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#191d3a'} />
      <Stack.Navigator
        screenOptions={() => ({
          presentation: 'modal',
          headerTintColor: 'white',
          headerStyle: {backgroundColor: '#191d3a'},
          tabBarActiveTintColor: '#191d3a',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: {paddingBottom: 5, fontSize: 13},
          tabBarStyle: {height: 60},
          headerTitleAlign: 'center',
        })}>
        <Stack.Screen
          name="Tab"
          component={TabContainer}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Registration" component={RegistrationPage} />
        <Stack.Screen
          name="CompleteRegistrationPage"
          options={({navigation}) => ({
            title: 'Complete Registration',
            animationEnabled: true,
            headerLeft: () => (
              <Icon
                size={28}
                name={'arrow-back'}
                color={'white'}
                onPress={() => {
                  logout();
                  navigation.navigate('Profile');
                }}
              />
            ),
          })}
          component={CompleteRegistrationPage}
        />
        <Stack.Screen
          name="SearchUsers"
          options={{title: 'Search Users', animationEnabled: false}}
          component={SearchUsers}
        />
        <Stack.Screen
          name="UserProfile"
          options={{title: 'Search Users', animationEnabled: true}}
          component={UserProfile}
        />
        <Stack.Screen
          name="NewTripPage"
          options={{title: 'New Trip', animationEnabled: false}}
          component={NewTripPage}
        />
        <Stack.Screen
          name="AroundMePage"
          options={{title: 'Around Me', animationEnabled: false}}
          component={AroundMePage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
