
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    StatusBar,
    Image,
    FlatList,
    RefreshControl,
    Pressable,
    ActivityIndicator,
    Dimensions,
    BackHandler,
    Alert,
    I18nManager,
    ScrollView
} from 'react-native'

import React, {
    useEffect,
    useState,
    useRef
} from 'react';

import {
    colors,
    height,
    sizes,
    width,
    FontFamily
} from '../constants/Theme';

import { LOCAL_IMAGES, LOCAL_ICONS, AllSourcePath } from '../constants/PathConfig';
import { HelperFunctions } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getData, setData, deleteData } from '../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../component/Header';


import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../assets/icons/Delete';
import Filter from '../assets/icons/Filter';
import FloatingLabelInput from '../component/FloatingLabelInput';
import FloatingDropdown from '../component/FloatingDropdown';
import CustomButton from '../component/CustomButton';

const FilterEmployeePage = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();

    const sampleData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const [search, setSearchVal] = useState('');
    const [selectedYear, setYear] = useState(null);
    const [selectMonth, setMonth] = useState(null);
    const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);

    const options = [
        { id: '1', label: '2024', value: '2024' },
        { id: '2', label: '2023', value: '2023' },
        { id: '3', label: '2022', value: '2022' },
    ];

    const handleSelect = (option) => {
        setYear(option);
        console.log(option)
    };

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL)
        }
    }, [isFocused]);


    useEffect(() => {

    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
            return () => {
                backHandler.remove();

            };
            return () => { };
        }, [])
    );

    const handleBackButton = () => {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    };


    const handlePress = () => {
        alert()
    };


    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Attendance')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 28, width: 28, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={true}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h5 }}>Search Employee</Text>
                        </View>

                        <View style={{ padding: 12, backgroundColor: colors.white, borderRadius: 8, marginBottom: 20 }}>
                            <FloatingLabelInput
                                label="Search"
                                placeholder="Search"
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                value={search}
                                onChangeText={setSearchVal}
                            />

                            <FloatingDropdown
                                label="Year"
                                value={selectedYear}
                                options={options}
                                onSelect={(option) => { setYear(option); }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectedYear ? true : false}
                                inputMargin={0}
                            />

                            <FloatingDropdown
                                label="Month"
                                value={selectMonth}
                                options={options}
                                onSelect={(option) => { setMonth(option); }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectMonth ? true : false}
                                inputMargin={20}
                            />
                            <FloatingDropdown
                                label="Attendance"
                                value={selectMonth}
                                options={options}
                                onSelect={(option) => { setMonth(option); }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectMonth ? true : false}
                                inputMargin={20}
                            />
                            <FloatingDropdown
                                label="Client"
                                value={selectMonth}
                                options={options}
                                onSelect={(option) => { setMonth(option); }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectMonth ? true : false}
                                inputMargin={20}
                            />
                            <FloatingDropdown
                                label="Branch"
                                value={selectMonth}
                                options={options}
                                onSelect={(option) => { setMonth(option); }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectMonth ? true : false}
                                inputMargin={20}
                            />
                            <FloatingDropdown
                                label="Department"
                                value={selectMonth}
                                options={options}
                                onSelect={(option) => { setMonth(option); }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectMonth ? true : false}
                                inputMargin={20}
                            />
                            <FloatingDropdown
                                label="Designation"
                                value={selectMonth}
                                options={options}
                                onSelect={(option) => { setMonth(option); }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectMonth ? true : false}
                                inputMargin={20}
                            />
                            <FloatingDropdown
                                label="HOD"
                                value={selectMonth}
                                options={options}
                                onSelect={(option) => { setMonth(option); }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectMonth ? true : false}
                                inputMargin={20}
                            />


                            <CustomButton
                                isLoading={waitLoaderStatus}
                                backgroundColor={colors.primary}
                                buttonText="Apply"
                                buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 }}
                                requireBorder={false}
                                borderColor={colors.white}
                                style={{ width: '100%', borderRadius: 8, marginTop:20,opacity:  1 }}
                                onPress={() => {
                                    
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#F5F7FB'
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
export default FilterEmployeePage;