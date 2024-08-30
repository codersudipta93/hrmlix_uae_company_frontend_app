import React from 'react';

//Navigation Import
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import {
  Splash,
  Signin,
  EployeeAttendanceView,
  FilterEmployeePage,
  EployeeAttendanceDetails,
  RegularizeShift,
  EditMonthlyAttendanceDetails,
  AttendanceSummary,
  AttendanceListingConsole,
  EmplyeeAttendance,
  DocumentVault 
} from '../screens';

import TabNavigator from './TabNavigator'
function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
     
        <Stack.Screen name="Splash" component={Splash} />
       
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{
          headerShown: false,
          // presentation: 'modal',
          animationTypeForReplace: 'push',
          animation: 'simple_push'
      }}/>
       
       <Stack.Screen name="Signin" component={Signin} />
       <Stack.Screen name="EployeeAttendanceView" component={EployeeAttendanceView} />
       <Stack.Screen name="FilterEmployeePage" component={FilterEmployeePage} />
       <Stack.Screen name="EployeeAttendanceDetails" component={EployeeAttendanceDetails} />
       <Stack.Screen name="RegularizeShift" component={RegularizeShift} />
       <Stack.Screen name="EditMonthlyAttendanceDetails" component={EditMonthlyAttendanceDetails} />
       <Stack.Screen name="AttendanceSummary" component={AttendanceSummary} />
       <Stack.Screen name="AttendanceListingConsole" component={AttendanceListingConsole} />
       <Stack.Screen name="EmplyeeAttendance" component={EmplyeeAttendance} />
        <Stack.Screen name="DocumentVault" component={DocumentVault} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;

