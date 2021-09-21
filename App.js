/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import SplashScreen from 'react-native-splash-screen';
import HomeScreen from './screens/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapScreen from './screens/MapScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome, faMap, faMapMarked} from '@fortawesome/free-solid-svg-icons';
import MapBoxScreen from './screens/MapBoxScreen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'#fff'}
      />
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={'Home'}
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color}) => {
              let icon;
              if (route.name === 'Home') {
                icon = faHome;
              } else if (route.name === 'Map') {
                icon = faMapMarked;
              } else if (route.name === 'MapBox') {
                icon = faMap;
              }
              return <FontAwesomeIcon icon={icon} color={color} size={20} />;
            },
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="MapBox" component={MapBoxScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  main: {
    flex: 1,
  },
});

export default App;
