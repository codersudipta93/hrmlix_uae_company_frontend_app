import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Theme from '../constants/Theme'
const InfoRow = (props) => {
    return (
        <View style={styles.row}>
            <View style={{borderRightWidth:1,width:'50%',borderColor: '#EEEEEE',paddingVertical:12}}><Text style={styles.label}>{props?.label}:</Text></View>
            <View style={{width:'50%',borderColor: '#EEEEEE',paddingVertical:12,paddingLeft:6}}><Text style={styles.value}>{props?.value}</Text></View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
       
        borderWidth:1,
        borderBottomWidth: 0,
        //paddingVertical: 12,
        borderColor: '#EEEEEE',
        paddingHorizontal:8
      },
      label: {
        fontSize: 13,
        fontFamily:Theme.FontFamily.bold,
      },
      value: {
        fontSize: 13,
        fontFamily:Theme.FontFamily.regular,
      },
      infoSection: {
        marginTop: 20,
      },
      section: {
        marginTop: 30,
        borderTopWidth: 2,
        borderColor: '#000',
        paddingVertical: 10,
      },
      sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
      },

});

export default InfoRow;
