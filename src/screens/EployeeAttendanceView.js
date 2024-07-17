
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
import { HelperFunctions, LocalData } from '../constants';
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
import Attendance from './TabScreens/Attendance';
import Shift from '../assets/icons/Shift';

const EployeeAttendanceView = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();

    const sampleData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const [monthCalenderData, setmonthCalenderData] = useState([]);

    //const [attendanceData, setAttedancedata] = usestate()

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL)
        }
    }, [isFocused]);


    useEffect(() => {
        let datesAndDays = HelperFunctions.getAllDatesAndDays(6, 2024);
        //console.log(datesAndDays);


        //console.log(LocalData?.AttendanceData);
        let attendance = LocalData?.AttendanceData
        for (let i = 0; i < datesAndDays.length; i++) {
            console.log(attendance.length)
            for (let a = 0; a < attendance.length; a++) {
                //console.log(a)
                if (datesAndDays[i].formatedDate == attendance[a].attendance_date.toString()) {
                    datesAndDays[i].attendanceObj = attendance[a];
                    console.log('found')
                }
            }
        }
        console.log("final data ====>")
        console.log(datesAndDays)
        setmonthCalenderData(datesAndDays);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            //const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
            return () => {
                //backHandler.remove();

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



    const ListRender = ({ index, item }) => (
        <View style={{ paddingTop: 8, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>

            <View style={{ paddingRight: 0, paddingLeft: 12, paddingRight: 25 }}>
                <View style={{ backgroundColor: colors.white, flex: 1, borderRadius: 4, flexDirection: 'column', justifyContent: 'flex-stat', alignItems: 'center' }}>
                    <Text style={{ letterSpacing: 0.4, color: '#8A8E9C', fontFamily: FontFamily.regular, fontSize: sizes.md + 1 }}>{HelperFunctions.getMonthName(item.month)}</Text>
                    <Text style={{ letterSpacing: 0.4, color: '#4E525E', fontFamily: FontFamily.bold, fontSize: sizes.h5, paddingVertical: 2 }}>{item.date ? item.date <= 9 ? 0 : null : null}{item.date}</Text>
                    <Text style={{ letterSpacing: 0.4, color: '#8A8E9C', fontFamily: FontFamily.regular, fontSize: sizes.md + 1 }}>{item.dayName}</Text>
                </View>

            </View>

            <View style={{ flex: 1, paddingRight: 12 }}>
                {item?.attendanceObj ? <>
                    {item?.attendanceObj?.leave_type == 'present' || item?.attendanceObj?.leave_type == 'full_day' ?
                        
                        
                        <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md }}>{ HelperFunctions.getTypeFullName(item?.attendanceObj?.first_half,true)}</Text>
                            </View>
                        </View>
                       
                       :
                        <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start',flexDirection:'row',paddingRight:12 }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md }}>{ HelperFunctions.getTypeFullName(item?.attendanceObj?.first_half,false)}</Text>
                                <Shift/>
                            </View>
                            <View style={{ marginTop: 5, backgroundColor:HelperFunctions.getColorCode(item?.attendanceObj?.second_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start',flexDirection:'row',paddingRight:12  }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.second_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md }}>{ HelperFunctions.getTypeFullName(item?.attendanceObj?.second_half,false)}</Text>
                                <Shift/>
                            </View>
                        </View>
                    }
                </> : 
                <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <View style={{ backgroundColor: '#fff3de', width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: '#FFAC10', fontFamily: FontFamily.medium, fontSize: sizes.md }}>No Log Entry</Text>
                    </View>
                </View>
                }
            </View>
        </View>
    );

    // 'H',
    // 'OT',
    // 'L',
    // 'ERL',
    // 'SKL',
    // 'MDL',
    // 'MTL',
    // 'PTL',
    // 'ANL',
    // 'AWP',
    // 'UWP',
    // 'LE1',
    // 'LE2',
    // 'LP1',
    // 'LP2',
    // 'WO',

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Attendance')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={true}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h5 }}>Brent Farrell DVM</Text>
                            <TouchableOpacity style={{ padding: 6, paddingHorizontal: 10 }}>
                                <Filter />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={monthCalenderData}
                            renderItem={ListRender}
                            contentContainerStyle={{ marginBottom: 30 }}
                        />



                    </View>
                </ScrollView>
            </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'
    },

    card: {
        backgroundColor: 'white',
        padding: 12,
        margin: 10,
        marginLeft: 0,
        marginRight: 10,
        borderRadius: 8,
        elevation: 3, // for Android
        shadowColor: '#00000012', // for iOS
        shadowOffset: { width: 0, height: 2 }, // for iOS
        shadowOpacity: 0.8, // for iOS
        shadowRadius: 2, // for iOS
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
    },

    cardMain: {
        backgroundColor: '#FFE0BB', // Background color for the rectangle
        position: 'relative',
        width: '48%',
        borderRadius: 8,
        padding: 12
    },
    cardSection1: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
    cardIconContainer: { height: 53, width: 53, borderRadius: 50, backgroundColor: '#F9F5F5', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
    cardBigLabel: { fontFamily: FontFamily.semibold, fontSize: sizes.h1 + 1, color: '#000000', marginLeft: 15 },
    cardLabel: { fontFamily: FontFamily.semibold, fontSize: sizes.h6, color: '#2B2B2B', marginTop: 15, textAlign: 'left' },
    backgroundImage: {
        width: 40, // Adjust as needed
        height: 30, // Adjust as needed
        position: 'absolute',
        bottom: 2,
        right: 6,
        opacity: 0.2
    },
    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    listCard: {
        backgroundColor: '#FFFFFF',
        //width: '100%',
        borderRadius: 8,
        padding: 12,
        //paddingVertical: 10,
        borderWidth: 0.5,
        borderColor: '#00000012',
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        //marginBottom: 8
    }

});
export default EployeeAttendanceView;