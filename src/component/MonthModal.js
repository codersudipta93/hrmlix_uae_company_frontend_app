import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity } from 'react-native';
import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme';
const MonthModal = ({ visible, onClose, selectedIndex }) => {
    const months = [
        { id: 1, name: 'January', monthIndex:1 },
        { id: 2, name: 'February', monthIndex:2 },
        { id: 3, name: 'March', monthIndex:3 },
        { id: 4, name: 'April', monthIndex:4 },
        { id: 5, name: 'May' , monthIndex:5},
        { id: 6, name: 'June', monthIndex:6 },
        { id: 7, name: 'July', monthIndex:7 },
        { id: 8, name: 'August', monthIndex:8 },
        { id: 9, name: 'September', monthIndex:9 },
        { id: 10, name: 'October', monthIndex:10 },
        { id: 11, name: 'November', monthIndex:11 },
        { id: 12, name: 'December', monthIndex:12 },
    ];

    const columns = 3; // Number of items per row



    const renderRow = ({ item }) => (
        <View style={styles.row}>
            {item.map(month => (
                <View key={month.id} style={styles.column}>
                    <TouchableOpacity onPress={() => onClose(month)} style={[styles.item,{backgroundColor: selectedIndex == month.monthIndex ? colors.primary : '#f0f0f0'}]}>
                        <Text style={[styles.itemText,{color: month.id == selectedIndex ? '#fff':'#4E525E'}]}>{month.name}</Text>
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