import { View, Text, TouchableOpacity, Image, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import Theme from '../constants/Theme'

const CustomButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[{ backgroundColor: props.backgroundColor ? props.backgroundColor : '#F1592A', borderRadius: 4, alignItems: 'center', justifyContent: 'center', height: props?.height ? props.height : 50, borderWidth: props.requireBorder ? 1 : 0, borderColor: props.borderColor ? props.borderColor : null }, props.style]}>
      {props.isLoading == true ?
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#fff"/>
          <Text style={[{ fontFamily: Theme.FontFamily.regular, color: Theme.colors.white, fontSize: Theme.sizes.h7, textAlign: 'center', textTransform: 'capitalize', marginLeft:4 }]}>
            Please Wait...
          </Text>
        </View>
        :
        <View style={{flexDirection:'row', justifyContent:'flex-start',alignItems:'center'}}>
          {props.requireIcon ?
            <Image
              style={props.iconStyle} 
              source={props.icon}
            /> : null}

          <Text style={[{ fontFamily: Theme.FontFamily.medium, color: Theme.colors.white, fontSize: Theme.sizes.s16, textAlign: 'center', textTransform: 'uppercase' }, props.buttonTextStyle]}>{props.buttonText}</Text>
        </View>

      }
    </TouchableOpacity >
  )
}

export default CustomButton