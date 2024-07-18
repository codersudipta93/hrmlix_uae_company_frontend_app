import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme'; // Adjust the import path as per your project structure
import Arrow from '../assets/icons/Arrow';

const FloatingDropdown = ({
    label,
    value,
    options,
    onSelect,
    editableStatus = true,
    labelBg,
    labelColor,
    inputColor,
    placeholderColor,
    inputContainerColor,
    inputMargin,
    children,
    onPress
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
    const containerHeight = useRef(new Animated.Value(60)).current;
    const labelBackgroundColor = useRef(new Animated.Value(0)).current;
    const borderColor = useRef(new Animated.Value(0)).current;
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        Animated.timing(animatedIsFocused, {
            toValue: isFocused || value ? 1 : 0,
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
        marginTop: inputMargin ? inputMargin : 0,
        justifyContent: 'center',
        width: '100%',
    };

    const handleSelectOption = (option) => {
        onSelect(option);
        setShowOptions(false);
    };

    return (
        <TouchableOpacity
            activeOpacity={editableStatus ? 0.6 : 1}
            onPress={() => {
                if (editableStatus) {
                    if (isFocused == true) {
                        setIsFocused(value ? true : false);
                    } else {
                        setIsFocused(true);
                    }

                    setShowOptions(!showOptions);
                }
            }}
            // onPress={onPress}
            style={[styles.touchable, { cursor: editableStatus ? 'text' : 'default' }]}
        >
            <Animated.View style={[containerStyle]}>
                <View style={{ paddingHorizontal: 5 }}>
                    <Animated.Text style={[labelStyle]}>
                        {label}
                    </Animated.Text>
                </View>
                <View style={[styles.fakeInput, { color: inputColor || '#D0DEEE' }]}>
                    <View>
                        {value ?
                            <Text style={{ color: inputColor ? inputColor : '#D0DEEE' }}>{value}</Text>
                            :
                            <Text style={{ color: 'Select Month' }}>{isFocused ? "Select " + label : ""}</Text>
                        }
                    </View>
                    <Arrow size={18} color={ isFocused == true || value != null ? "#60B057": '#404040'} style={{ transform: [{ rotate: '0deg' }] }} />
                </View>
            </Animated.View>
            {children}
            {showOptions && (
                <View style={styles.optionsContainer}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.optionItem}
                                onPress={() => handleSelectOption(item.value)}
                            >
                                <Text style={styles.optionText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        width: '100%',
    },
    fakeInput: {
        height: 42,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        fontSize: 14,
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        maxHeight: 200,
        marginTop: 6
        //zIndex: 100,
        //elevation: 5, // For Android elevation
    },
    optionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default FloatingDropdown;
