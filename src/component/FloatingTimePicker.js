import React, { useState, useEffect, useRef, Children } from 'react';
import { ScrollView, View, Animated, StyleSheet, Text, TouchableOpacity, FlatList, Pressable,Image } from 'react-native';
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme'; // Adjust the import path as per your project structure
import Arrow from '../assets/icons/Arrow';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Time from '../assets/icons/Time';
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import TimeIcon from '../assets/icons/TimeIcon';

const FloatingTimePicker = ({
    labelName,
    selectedValue,
    options,
    onSelect,
    editableStatus = true,
    labelBg,
    labelColor,
    inputColor,
    placeholderColor,
    inputContainerColor,
    inputMargin,
    listLabelKeyName = ['label'],
    children,
    timeIconPress,
    confirmDateClick,
    pickerType,
    pickerIcon,
    pickerIconStyle
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedIsFocused = useRef(new Animated.Value(selectedValue ? 1 : 0)).current;
    const containerHeight = useRef(new Animated.Value(60)).current;
    const labelBackgroundColor = useRef(new Animated.Value(0)).current;
    const borderColor = useRef(new Animated.Value(0)).current;
    const [showOptions, setShowOptions] = useState(false);
    // const [datePickerStatus, setdatePickerStatus] = useState(false);

    useEffect(() => {
        console.log(selectedValue)
        Animated.timing(animatedIsFocused, {
            toValue: isFocused || selectedValue != '' ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(containerHeight, {
            toValue: isFocused ? 45 : 48,
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
    }, [isFocused, selectedValue]);

    const labelStyle = {
        position: 'absolute',
        fontFamily: FontFamily.regular,
        lineHeight: 15,
        top: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [12, -10],
        }),
        fontSize: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [14, 12],
        }),
        color: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [placeholderColor || '#D0DEEE', labelColor || '#FFFFFF'],
        }),
        paddingHorizontal: 4,
        backgroundColor: labelBackgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: [animatedIsFocused ? labelBg || '#0E1F33' : 'transparent', labelBg || '#0E1F33'],
        }),
    };

    const containerStyle = {
        height: containerHeight,
        borderColor: borderColor.interpolate({
            inputRange: [0, 1],
            outputRange: [inputContainerColor || '#555', '#60B057'],
        }),
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 6,
        marginBottom: inputMargin ? inputMargin : 0,
        justifyContent: 'center',
        width: '100%',
    };



    return (
        <Pressable
            activeOpacity={editableStatus ? 0.6 : 1}
            onPress={() => {
                if (editableStatus) {
                    if (isFocused == true) {
                        setIsFocused(selectedValue != '' ? true : false);
                    } else {
                        setIsFocused(true);
                    }

                    setShowOptions(!showOptions);
                }

            }}

            style={[styles.touchable, { cursor: editableStatus ? 'text' : 'default' }]}
        >
            <Animated.View style={[containerStyle, { borderColor: isFocused == true || selectedValue != "" ? "#60B057" : '#CACDD4' }]}>
                <View style={{ paddingHorizontal: 5 }}>
                    <Animated.Text style={[labelStyle]}>
                        {labelName}
                    </Animated.Text>
                </View>
                <View style={[styles.fakeInput, { color: inputColor || '#D0DEEE' }]}>

                    <View>
                        {selectedValue != '' ?
                            <Text style={[styles.optionText, { color: inputColor, fontFamily: FontFamily.semibold, textTransform: 'uppercase' }]}>{selectedValue != "Invalid date" ? selectedValue : "--:-- --"}</Text>
                            :
                            <Text style={[styles.optionText, { color: 'grey' }]}>{isFocused ? "Select " + labelName : ""}</Text>
                        }
                    </View>

                    {pickerIcon ?
                        <Image
                            style={pickerIconStyle}
                            source={pickerIcon}
                        /> :
                        <TimeIcon height="20" width="20" color="#60B057" />
                    }


                </View>
            </Animated.View>

            <DateTimePickerModal
                isVisible={showOptions}
                locale="en_GB"
                // mode="time"
                mode={pickerType ? pickerType : "time"}
                onConfirm={(time) => {
                    if (isFocused == true) {
                        setIsFocused(selectedValue != '' ? true : false);
                    } else {
                        setIsFocused(true);
                    }

                    setShowOptions(!showOptions);
                    confirmDateClick(time);
                }}
                onCancel={() => {
                    if (isFocused == true) {
                        setIsFocused(selectedValue != '' ? true : false);
                    } else {
                        setIsFocused(true);
                    }

                    setShowOptions(!showOptions);
                }}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    touchable: {
        width: '100%',
    },
    fakeInput: {
        height: 42,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 13,
        paddingHorizontal: 6,
        fontFamily: FontFamily.semibold,
    },
    inputText: {
        color: 'red',
    },
    optionsContainer: {
        //position: 'absolute',
        // top: 60, // Adjust the top position as per your UI design
        //left: 0,
        // right: 0,
        // backgroundColor: '#FFFFFF',
        // borderWidth: 1,
        // borderColor: '#DDDDDD',
        // borderRadius: 8,
        // maxHeight: 200,
        // marginTop: 6
        //zIndex: 100,
        //elevation: 5, // For Android elevation
    },
    optionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    optionText: {
        fontSize: sizes.h6,
        color: '#333',
        textTransform: 'none'
    },
});

export default FloatingTimePicker;
