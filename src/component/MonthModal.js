import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme';
import IonIcon from 'react-native-vector-icons/Ionicons';
const MonthModal = ({ visible, onClose,onPressClose, selectedIndex }) => {
    const months = [
        { id: 1, name: 'January', monthIndex: 0 },
        { id: 2, name: 'February', monthIndex: 1 },
        { id: 3, name: 'March', monthIndex: 2 },
        { id: 4, name: 'April', monthIndex: 3 },
        { id: 5, name: 'May', monthIndex: 4 },
        { id: 6, name: 'June', monthIndex: 5 },
        { id: 7, name: 'July', monthIndex: 6 },
        { id: 8, name: 'August', monthIndex: 7 },
        { id: 9, name: 'September', monthIndex: 8 },
        { id: 10, name: 'October', monthIndex: 9 },
        { id: 11, name: 'November', monthIndex: 10 },
        { id: 12, name: 'December', monthIndex: 11 },
    ];

    const columns = 3; // Number of items per row



    const renderRow = ({ item }) => (
        <View style={styles.row}>

            {item.map(month => (
                <View key={month.id} style={styles.column}>
                    <TouchableOpacity onPress={() => onClose(month)} style={[styles.item, { backgroundColor: selectedIndex == month.monthIndex ? colors.primary : '#f0f0f0' }]}>
                        <Text style={[styles.itemText, { color: month.monthIndex == selectedIndex ? '#fff' : '#4E525E' }]}>{month.name}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );

    const formatData = (data, columns) => {
        const rows = Math.ceil(data.length / columns);
        let index = 0;
        let formattedData = [];
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < columns; j++) {
                if (index < data.length) {
                    row.push(data[index]);
                    index++;
                }
            }
            formattedData.push(row);
        }
        return formattedData;
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => onClose(null)}
        >
            <View style={styles.modalContainer}>

                <View style={styles.modalContent}>
                    <Pressable onPress={onPressClose} style={{ alignSelf: 'flex-end', paddingBottom: 10, paddingTop: 10 }}>
                        <IonIcon
                            name={"close"}
                            size={24}
                            color={colors.primary}
                        />
                    </Pressable>

                    <FlatList
                        data={formatData(months, columns)}
                        renderItem={renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={1}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 0,
        borderRadius: 10,
        width: '88%',
        maxHeight: '80%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    column: {
        flex: 1,
        paddingHorizontal: 5,
    },
    item: {

        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    itemText: {
        fontSize: 14,
    },
});

export default MonthModal;