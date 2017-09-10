import React from 'react';
import {Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {TabNavigator, StackNavigator, TabBarBottom} from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DataScreen from '../screens/DataScreen';

const HomeStack = StackNavigator({
  Main: {
    screen: HomeScreen,
    
  },
  Data: {
    screen: DataScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Data',
    }),
  }
}, {headerMode: 'none'});

export default TabNavigator({
  Home: {
    screen: HomeStack
  },
  Links: {
    screen: LinksScreen
  },
  // Settings: { screen: SettingsScreen, },
}, {
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({focused}) => {
      const {routeName} = navigation.state;
      let iconName;
      switch (routeName) {
        case 'Home':
          iconName = Platform.OS === 'ios'
            ? `ios-heart${focused
              ? ''
              : '-outline'}`
            : 'md-heart';
          break;
        case 'Links':
          iconName = Platform.OS === 'ios'
            ? `ios-paper${focused
              ? ''
              : '-outline'}`
            : 'md-paper';
          break;
        case 'Settings':
          iconName = Platform.OS === 'ios'
            ? `ios-options${focused
              ? ''
              : '-outline'}`
            : 'md-options';
      }
      return (<Ionicons
        name={iconName}
        size={28}
        style={{
        marginBottom: -3
      }}
        color={focused
        ? Colors.tabIconSelected
        : Colors.tabIconDefault}/>);
    }
  }),
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false
});
