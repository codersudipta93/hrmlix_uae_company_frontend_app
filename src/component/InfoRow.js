import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Theme from '../constants/Theme'
const InfoRow = (props) => {
    return (
        <View style={[styles.row,{borderBottomWidth: props.borderBottom ? 1 : 0,}]}>
            <View style={{borderRightWidth:1,width:'50%',borderColor: '#EEEEEE',paddingVertical:12}}><Text style={[styles.label,props.labelStyle]}>{props?.label}:</Text></View>
            <View style={{width:'50%',borderColor: '#EEEEEE',paddingVertical:12,paddingLeft:6}}><Text style={[styles.value,props.valueStyle]}>{props?.value}</Text></View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItem:'center',
        borderWidth:1,
        borderBottomWidth: 0,
        //paddingVertical: 12,
        borderColor: '#E7EAF1',
        paddingHorizontal:8
      },
      label: {
        fontSize: 13,
        fontFamily:Theme.FontFamily.medium,
        lineHeight:15,
        color:'#4E525E'
      },
      value: {
        fontSize: 13,
        fontFamily:Theme.FontFamily.regular,
        lineHeight:15,
        color:'#4E525E'
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
