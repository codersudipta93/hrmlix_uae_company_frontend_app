import React from 'react';

//Navigation Import
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import {
  Splash,
  Signin
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
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;

