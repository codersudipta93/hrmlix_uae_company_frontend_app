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

const NoDataFound = ({ isLoading }) => {

  useEffect(() => {
    console.log(isLoading);
  }, []);

  return (
    <View style={{ marginTop: 180, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#868F9A' }}>Data not found</Text>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default NoDataFound;
