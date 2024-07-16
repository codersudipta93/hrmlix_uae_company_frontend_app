import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme';
import { LOCAL_IMAGES, LOCAL_ICONS } from '../constants/PathConfig';

const Loader = ({ isLoading }) => {

  useEffect(() => {
    console.log(isLoading);
  }, []);

  return isLoading ? (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)	',
      }}>
      <View
        style={{
          width: sizes.width * 0.14,
          height: sizes.width * 0.14,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          shadowColor: '#171717',
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}>
        {/* <ActivityIndicator size={'large'} colors={[colors.primary, '#225FD8', '#DB1414']} /> */}
        <Image source={LOCAL_ICONS.loader} style={{ height: '90%', width: '90%', borderRadius: 4 }} />
      </View>
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
 
});

export default Loader;
