import { View, Text, TouchableOpacity, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme';
import { useNavigation } from '@react-navigation/native';

import CustomButton from './CustomButton';

import IonIcon from 'react-native-vector-icons/Ionicons';
import Arrow from '../assets/icons/Arrow';

const CustomHeader = (props) => {

    const navigation = useNavigation();

    return (
        <View onPress={props.onPress} style={[{ paddingHorizontal: 12, backgroundColor: props.backgroundColor ? props.backgroundColor : colors.white, alignItems: 'center', justifyContent: 'center', height: 75, borderWidth: props.requireBorder ? 1 : 0, borderColor: props.borderColor ? props.borderColor : null }, props.style]}>

            <View style={{ width: '60%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                <Pressable onPress={()=>{navigation.goBack()}}><Arrow size={28} color='#404040' style={{ transform: [{ rotate: '90deg' }] }} /></Pressable>
                <Text style={[{ marginLeft: 8, fontFamily: FontFamily.semibold, color: "#4E525E", fontSize: sizes.h5, textAlign: 'left' }, props.buttonTextStyle]}>{props.buttonText}</Text>
            </View>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                {/* <TouchableOpacity style={styles.langInput} onPress={props.changeLanguage}>
                    <Text style={styles.langName}>{props.language}</Text>
                    <IonIcon
                        name="chevron-down-outline"
                        size={15}
                        color={colors.black}
                    />
                </TouchableOpacity> */}
                {props.searchIcon == true ?
                    <TouchableOpacity style={{ marginRight: 11 }}>
                        <IonIcon
                            name="search"
                            size={20}
                            color="#8A8E9C"
                        />
                    </TouchableOpacity> : null}
                <TouchableOpacity onPress={props.onPressUser} style={{ borderWidth: 1.5, borderRadius: 50, borderColor: colors.primary }}>
                    <Image
                        style={props.iconStyle}
                        source={props.icon}
                    />
                </TouchableOpacity>
            </View>



        </View>
    )
}

const styles = StyleSheet.create({
    langInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
        // marginTop: 14
    },
    langName: {
        color: 'black',
        fontFamily: FontFamily.bold,
        fontSize: sizes.md + 1,
        textTransform: 'capitalize'
    }
});
export default CustomHeader