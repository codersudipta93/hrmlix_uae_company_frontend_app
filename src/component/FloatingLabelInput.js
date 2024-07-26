import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, StyleSheet, Text, I18nManager,Keyboard } from 'react-native';
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme';

const FloatingLabelInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    editableStatus,
    secureTextEntryStatus,
    inputStyle,
    customLabelStyle,
    inputContainerColor,
    labelBg,
    labelColor,
    inputColor,
    placeholderColor
}) => {

    const [isFocused, setIsFocused] = useState(false);
    const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
    const containerHeight = useRef(new Animated.Value(60)).current; // Initial container height
    const labelBackgroundColor = useRef(new Animated.Value(0)).current;
    const borderColor = useRef(new Animated.Value(0)).current;



    useEffect(() => {

        Animated.timing(animatedIsFocused, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(containerHeight, {
            toValue: isFocused ? 45 : 48, // Decrease height on focus
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(labelBackgroundColor, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(borderColor, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const labelStyle = {
        position: 'absolute',
        fontFamily: FontFamily.regular,
        top: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [12, -10],
        }),
        fontSize: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [13, 12],
        }),
        color: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [placeholderColor ? placeholderColor :'#D0DEEE', labelColor ? labelColor :'#FFFFFF'],
        }),
        paddingHorizontal: 4,
        backgroundColor: labelBackgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: [animatedIsFocused ? labelBg?labelBg:'#0E1F33':'transparent', labelBg?labelBg:'#0E1F33'],
        }),
    };

    const containerStyle = {
        height: containerHeight,
        borderColor: borderColor.interpolate({
            inputRange: [0, 1],
            outputRange: [inputContainerColor ? inputContainerColor :'#555', '#60B057'], // Set the desired color here
        }),
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 6,
        marginBottom: 20,
        justifyContent: 'center',
        width: '100%',
    };

    return (
        <Animated.View style={[containerStyle, {}]}>
            <View style={{paddingHorizontal:5}}>
                <Animated.Text style={[labelStyle]}>
                    {label}
                </Animated.Text>
            </View>

            <TextInput
                style={[styles.input,{color:inputColor?inputColor:'#D0DEEE'}]}
                editable={editableStatus ? editableStatus : true}
                secureTextEntry={secureTextEntryStatus}
                value={value}
                onChangeText={onChangeText}
                placeholder={isFocused ? placeholder : ''}
                placeholderTextColor="#aaa"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                blurOnSubmit
                underlineColorAndroid="transparent"
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 42,
        fontSize: 13,
        color: '#D0DEEE',
        paddingHorizontal: 6,
        fontFamily: FontFamily.semibold,
        textAlign: I18nManager.isRTL ? 'right' : 'left'

    },
});

export default FloatingLabelInput;
