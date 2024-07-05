import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { colors, height, sizes, width, FontFamily } from '../constants/Theme';
import { LOCAL_IMAGES } from '../constants/PathConfig';

const SideMenu = ({ visible, onClose }) => {
    const translateY = useRef(new Animated.Value(-height)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: -height,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.overlayTouchable} onPress={onClose}>
                    <Animated.View style={[styles.sideMenu, { transform: [{ translateY }] }]}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ height: 42, width: 42, borderRadius: 50 }}
                                source={LOCAL_IMAGES.user}
                            />
                            <Text style={{ marginTop: 12 }}>Ivan Web Solutions</Text>
                            <Text>ivan@ivaninfotech.com</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={{ marginTop: 15 }}>
                            <Text style={styles.menuItem}>Company Setting</Text>
                            <Text style={styles.menuItem}>Sign Out</Text>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    overlayTouchable: {
        flex: 1,
        marginTop: 65,
    },
    sideMenu: {
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EDEDF2',
        padding: 20,
        position: 'absolute',
        top: 0,
    },
    separator: {
        width: '100%',
        height: 1.2,
        backgroundColor: '#C4CCDCD6',
        marginTop: 12,
    },
    menuItem: {
        paddingVertical: 10,
        fontFamily: FontFamily.semibold,
        fontSize: sizes.h6,
        color: '#2B2B2B',
        textAlign: 'left',
    },
});

export default SideMenu;
