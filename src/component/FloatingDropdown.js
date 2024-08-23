import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Animated, StyleSheet, Text, TouchableOpacity, FlatList, Pressable } from 'react-native';
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme'; // Adjust the import path as per your project structure
import Arrow from '../assets/icons/Arrow';
import IonIcon from 'react-native-vector-icons/Ionicons';

const FloatingDropdown = ({
    labelName,
    selectedValueData,
    options,
    onSelect,
    editableStatus = true,
    labelBg,
    labelColor,
    inputColor,
    placeholderColor,
    inputContainerColor,
    inputMargin,
    bottomMargin,
    listLabelKeyName = ['label'],
    multiSelect = false,
    bracketAfterPositionIndex, // user for bracket seprator
    textTransform
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedIsFocused = useRef(new Animated.Value(selectedValueData ? 1 : 0)).current;
    const containerHeight = useRef(new Animated.Value(60)).current;
    const labelBackgroundColor = useRef(new Animated.Value(0)).current;
    const borderColor = useRef(new Animated.Value(0)).current;
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        console.log(selectedValueData)
        Animated.timing(animatedIsFocused, {
            toValue: isFocused || selectedValueData != '' ? 1 : 0,
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
    }, [isFocused, selectedValueData]);

    const labelStyle = {
        position: 'absolute',
        fontFamily: FontFamily.regular,
        lineHeight:15,
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
        multiSelect == true ? setShowOptions(true) : setShowOptions(false);
    };

    return (
        <Pressable
            activeOpacity={editableStatus ? 0.6 : 1}
            onPress={() => {
                if (editableStatus) {
                    if (isFocused == true) {
                        setIsFocused(selectedValueData != '' ? true : false);
                    } else {
                        setIsFocused(true);
                    }

                    setShowOptions(!showOptions);
                }

            }}

            style={[styles.touchable, { cursor: editableStatus ? 'text' : 'default', marginBottom: bottomMargin ?  bottomMargin : 0 }]}
        >
            <Animated.View style={[containerStyle,{borderColor:isFocused == true || selectedValueData != "" ? "#60B057" : '#CACDD4'}]}>
                <View style={{ paddingHorizontal: 5 }}>
                    <Animated.Text style={[labelStyle]}>
                        {labelName}
                    </Animated.Text>
                </View>
                <View style={[styles.fakeInput, { color: inputColor || '#D0DEEE' }]}>
                    {multiSelect == true ?
                        <View>
                            {selectedValueData != '' ?
                                <View style={{ flexDirection: 'row' }}>
                                    {selectedValueData.length > 1 ? <>
                                        {listLabelKeyName.map((value, index) => {
                                            return (
                                                <Text style={[styles.optionText, { color: inputColor, fontFamily: FontFamily.semibold, textTransform:'capitalize' }]}>{index > bracketAfterPositionIndex ? '(' + selectedValueData[0][value] + ')' : selectedValueData[0][value]} </Text>
                                            )
                                        })}

                                        <Text style={[styles.optionText, { color: inputColor || '#D0DEEE', fontFamily: FontFamily.semibold, textTransform:'capitalize' }]}>
                                            + {(selectedValueData.length - 1) + ' more'}
                                        </Text>

                                    </> :

                                        <>
                                            {listLabelKeyName.map((value, index) => {
                                                return (
                                                    <Text style={[styles.optionText, { color: inputColor, fontFamily: FontFamily.semibold, textTransform:'capitalize' }]}>{index > bracketAfterPositionIndex ? '(' + selectedValueData[0][value] + ')' : selectedValueData[0][value]} </Text>
                                                )
                                            })}
                                        </>
                                    }
                                </View>
                                :
                                <Text style={[styles.optionText, { color: 'grey' }]}>{isFocused ? "Select " + labelName : ""}</Text>
                            }
                        </View> :

                        <View>
                            {selectedValueData != '' ?
                                <View style={{ flexDirection: 'row' }}>
                                    {listLabelKeyName.map((value, index) => {
                                        return (

                                            <Text style={[styles.optionText, { color: inputColor, fontFamily: FontFamily.semibold, textTransform: textTransform ? textTransform :'capitalize' }]}>{index > bracketAfterPositionIndex ? '(' + selectedValueData[value] + ')' : selectedValueData[value]}</Text>
                                        )
                                    })}
                                    {/* <Text style={[styles.optionText, { color: inputColor || '#D0DEEE', fontFamily: FontFamily.semibold }]}>{selectedValueData}</Text> */}
                                </View>
                                :
                                <Text style={[styles.optionText, { color: 'grey' }]}>{isFocused ? "Select " + labelName : ""}</Text>
                            }
                        </View>
                    }
                    <Arrow size={18} color={isFocused == true || selectedValueData != "" ? "#60B057" : '#404040'} style={{ transform: [{ rotate: '0deg' }] }} />
                </View>
            </Animated.View>

            {showOptions && (
                <View style={styles.optionsContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled
                        data={options}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.optionItem, { marginLeft: 0 }]}
                                onPress={() => handleSelectOption(item)}
                            >
                                {multiSelect == true ?
                                    <IonIcon
                                        name={item.selected ? "checkbox-outline" : "square-outline"}
                                        size={18}
                                        color={item?.selected == true ? colors.primary : '#333'}
                                    />
                                    : null}

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    {listLabelKeyName.map((key, index) => {
                                        return (
                                            <Text style={[styles.optionText, { textTransform: 'capitalize', color: item?.selected == true ? colors.primary : '#333' }]}> {index > bracketAfterPositionIndex ? item[key] != "" ? ' (' + item[key] + ')' : "" : item[key]}</Text>
                                        )
                                    })}
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
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

export default FloatingDropdown;
