import React, { useEffect, useRef } from 'react';

//Bottom Navigation import
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import * as Animatable from 'react-native-animatable';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert
} from 'react-native';

import {
  Dashboard,
  Employees,
  Shift,
  Attendance,
  Profile
} from '../screens';
import { colors, sizes, FontFamily } from '../constants/Theme';
import { LOCAL_ICONS } from '../constants/PathConfig';

import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useFocusEffect, useNavigationState } from '@react-navigation/native';

const TabArr = [
  {
    route: 'Dashboard',
    label: 'Dashboard',
    activeIcon: LOCAL_ICONS.Dashboard,
    component: Dashboard,
  },{
    route: 'Attendance',
    label: 'Attendance',
    activeIcon: LOCAL_ICONS.calender,
    component: Attendance,
  },{
    route: 'Employees',
    label: 'Employees',
    activeIcon: LOCAL_ICONS.employees,
    component: Employees,
  },{
    route: 'Shift',
    label: 'Shift',
    activeIcon: LOCAL_ICONS.shift,
    component: Shift,
  },{
    route: 'Profile',
    label: 'Profile',
    activeIcon: LOCAL_ICONS.profile,
    component: Profile,
  },
];

const TabButton = props => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const dispatch = useDispatch(); //Redux
  const { parentPage } = useSelector(state => state.project);

  useEffect(() => {

    // if (focused) {

    //   // viewRef.current.animate({0: {scale: 0.5, rotate: '0deg'}, 1: {scale: 1.5, rotate: '360deg'}});
    //   viewRef.current.animate({
    //     0: {scale: 0.5, rotate: '0deg'},
    //     1: {scale: 1, rotate: '0deg'},
    //   });
    // } else {
    //   // viewRef.current.animate({0: {scale: 1.5, rotate: '360deg'}, 1: {scale: 0.9, rotate: '0deg'}});
    //   viewRef.current.animate({
    //     0: {scale: 1, rotate: '0deg'},
    //     1: {scale: 0.9, rotate: '0deg'},
    //   });
    // }
   
  }, [focused]);

  const tabClick = (()=>{
    onPress();
    //dispatch(_setParentPageStatus(true))
})

useFocusEffect(
  React.useCallback(() => {
    //dispatch(_setParentPageStatus(true))
    return () => {
     
    };
  }, [])
);


  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <View style={{ flex: 3.5, }}>
          <View
            //ref={viewRef}
            duration={1000}
            style={styles.animatable_container}>
            <Image
              style={{
                height: item.label == 'Employees' ? 14 : 16,
                width: item.label == 'Employees' ? 19 : 16,
                tintColor: focused ? colors.primary : '#868F9A',
              }}
              source={item.activeIcon}
            />

            <Text
              style={{
                paddingLeft: 7,
                color: focused ? colors.primary : '#868F9A',
                fontSize: sizes.md-1,
                fontFamily: FontFamily.regular,
                marginTop: 8
              }}>
              {item.label}
            </Text>

          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        tabBarStyle: {
          paddingLeft: 10,
          paddingRight: 10,
          elevation: 5,
          shadowColor: '#000000',
          shadowOffset: { height: 5 },
          shadowOpacity: 0.75,
          shadowRadius: 5,
          backgroundColor: '#0E1F33',
          height: 65
        },
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E1F33',

  },
  animatable_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});