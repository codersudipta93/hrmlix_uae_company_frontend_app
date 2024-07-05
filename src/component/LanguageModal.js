import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme';
import IonIcon from 'react-native-vector-icons/Ionicons';
const LanguageModal = ({ isVisible, onClose, onSelectLanguage, languages,positionRight }) => {
    //const languages = [{label:'English', value:'en'},{label: 'Arabic', value:'ar'}]; // Example list of languages

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalContainer} onPress={onClose}>
                <View style={[styles.modalContent]}>
                    {/* <Text style={styles.modalTitle}>Choose Language</Text> */}
                    {languages.map((language, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.languageButton}
                            onPress={() => {
                                onSelectLanguage(language)
                                onClose()
                            }}
                        >
                            <Text style={[styles.languageText, { color: language?.selected == true ? colors.primary : colors.secondary }]}>{language.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        //padding: 18,
        borderRadius: 10,
        width: '25%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        maxHeight: 200,
        position: 'absolute',
        zIndex: 1,
        top: 45,
        
    },
    modalTitle: {
        fontSize: sizes.h5,
        fontFamily: FontFamily.bold,
        marginBottom: 10,
        color: colors.secondary
    },
    languageButton: {
        paddingVertical: 10,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    languageText: {
        fontSize: sizes.h6,
        fontFamily: FontFamily.medium,
        marginLeft: 4
    },
    closeButton: {
        marginTop: 10,
    },
    closeButtonText: {
        color: colors.error,
        fontSize: 16,
    },
});

export default LanguageModal;
