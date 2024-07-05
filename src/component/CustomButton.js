import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'
import React from 'react'
import Theme from '../constants/Theme'

const CustomButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[{ backgroundColor: props.backgroundColor ? props.backgroundColor : '#F1592A', borderRadius: 4, alignItems: 'center', justifyContent: 'center', height: 50, borderWidth: props.requireBorder ? 1 : 0, borderColor: props.borderColor ? props.borderColor : null }, props.style]}>
      {props.requireIcon ?
        <Image
          style={props.iconStyle}
          source={props.icon}
        /> : null}
      <Text style={[{ fontFamily: Theme.FontFamily.medium, color: Theme.colors.white, fontSize: Theme.sizes.s16, textAlign: 'center', textTransform: 'uppercase' }, props.buttonTextStyle]}>{props.buttonText}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton