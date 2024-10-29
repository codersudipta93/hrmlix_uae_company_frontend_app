
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

import { postApi } from '../Service/service';


import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../assets/icons/Delete';
import Filter from '../assets/icons/Filter';

import Shift from '../assets/icons/Shift';
import Time from '../assets/icons/Time';
import CustomButton from '../component/CustomButton';
import AttendanceIn from '../assets/icons/AttendanceIn';
import AttendanceOut from '../assets/icons/AttendanceOut';

const EployeeAttendanceDetails = props => {

    const dispatch = useDispatch();
    const { userDetails,companyData, token } = useSelector(state => state.project);
    const isFocused = useIsFocused();
    const route = useRoute();
    const { t, i18n } = useTranslation();

    const [data, setData] = useState("")


    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL)
        }
    }, [isFocused]);


    useEffect(() => {
        if (isFocused == true) {
            if (props?.route?.params) {
                //console.log("paramData ===>")

                updateData();
            }
        }
    }, [isFocused]);


    const updateData = () => {
        let previousPageFilterData = props?.route?.params?.filterParam;
        console.log("=========>>>>>", props?.route?.params?.pdata?.formattedDate)
        let pData = {
            "pageno": 1,
            "search_month": previousPageFilterData?.search_month?.value,
            "search_year": previousPageFilterData?.search_year?.value,
            "search_day": props?.route?.params?.pdata?.date,
            "attendance_type": previousPageFilterData?.attendance_type ? previousPageFilterData?.attendance_type?.value : 'time',
            "branch_id": (previousPageFilterData?.branchData != "" && previousPageFilterData?.branchData != "[]") ? previousPageFilterData?.branchData : "",
            "designation_id": previousPageFilterData?.designationData != "" && previousPageFilterData?.designationData != "[]" ? previousPageFilterData?.designationData : "",
            "department_id": previousPageFilterData?.departmentData != "" && previousPageFilterData?.departmentData != "[]" ? previousPageFilterData?.departmentData : "",
            "hod_id": previousPageFilterData?.hodData != "" && previousPageFilterData?.hodData != "[]" ? previousPageFilterData?.hodData : "",
            "client_id": previousPageFilterData?.clientData != "" && previousPageFilterData?.clientData != "[]" ? previousPageFilterData?.clientData : "",
            "searchkey": props?.route?.params?.pdata?.emp_id
        }

        if (pData) {
            //setLoadingStaus(true)
            postApi("company/get-attendance-data", pData, token)
                .then((resp) => {
                    console.log(JSON.stringify(resp));
                    if (resp?.status == 'success') {
                        if (resp?.employees?.docs != "") {
                            let resData = resp?.employees?.docs[0]
                            if (resData != "") {
                                // let datesAndDays = HelperFunctions.getAllDatesAndDays(parseInt(previousPageFilterData?.search_month?.value), previousPageFilterData?.search_year?.value);
                                let attendance = resData?.attendance;
                                if (attendance != "") {
                                    for (let a = 0; a < attendance.length; a++) {
                                        if (attendance[a].attendance_date == props?.route?.params?.pdata?.formattedDate) {
                                            //let a = attendance[a];
                                            console.log("attendance======>", attendance[a]);
                                            let previousAttendanceData = { ...props?.route?.params?.pdata }
                                            previousAttendanceData.attendanceObj = attendance[a];
                                            console.log(previousAttendanceData)
                                            setData(previousAttendanceData)
                                        }
                                    }

                                }
                            }
                        } else {
                            let previousAttendanceData = { ...props?.route?.params?.pdata }
                            setData(previousAttendanceData)
                        }
                    } else {
                        HelperFunctions.showToastMsg(resp.message);
                    }

                }).catch((err) => {
                    console.log(err);
                    //setLoadingStaus(false)
                    HelperFunctions.showToastMsg(err.message);
                })
        } else {
            setLoadingStaus(false)
        }
    }


    const breakList = ({ index, item }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 8, marginRight: 25 }}>
                <AttendanceIn width="10" height="18" />
                <Text style={{ marginLeft: 6, fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#6F7880' }}>{item?.break_stime}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 8 }}>
                <AttendanceOut width="10" height="18" />
                <Text style={{ marginLeft: 6, fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#6F7880' }}>{item?.break_etime}</Text>
            </View>
        </View>
    );


    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={t('Attendance')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 0 }}>
                        <View style={{ borderWidth: 1, paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E2538' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ marginRight: 12 }}>
                                    <Image source={{ uri: data?.profile_pic != null && data?.profile_pic != "null" ? data?.profile_pic : 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: 35, width: 35, borderRadius: 50, objectFit: 'cover' }} />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: colors.white, fontSize: sizes.h6 }}>{data?.emp_first_name} {data?.emp_last_name}</Text>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#C8C8C8', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>ID: {data?.emp_id}</Text>
                                    <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Image
                                            style={{
                                                height: 14,
                                                width: 14,
                                                tintColor: '#C8C8C8',
                                            }}
                                            source={LOCAL_ICONS.calender}
                                        />
                                        <Text style={{ marginLeft: 4, fontFamily: FontFamily.medium, color: '#C8C8C8', fontSize: sizes.md, textTransform: 'uppercase' }}>{HelperFunctions.getMonthName(data?.month - 1)} {data?.date}, {data?.year}</Text>
                                    </View>
                                </View>

                            </View>

                        </View>

                        {props?.route?.params?.filterParam?.attendance_type?.value == "time" ?
                            <View style={{ paddingHorizontal: 16, marginTop: 25 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Shift />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6, color: '#4E525E' }}>Shift:</Text>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#6F7880', textTransform: 'capitalize' }}> {data?.shift_data?.shift_name ? data?.shift_data?.shift_name : ""}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 15 }}>
                                    <View style={{ marginLeft: 8, backgroundColor: '#EEEEEE', paddingVertical: 8, paddingLeft: 10, paddingRight: 25, width: '40%' }}>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: '#4E525E' }}>GROSS HOURS: </Text>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: '#4E525E', lineHeight: 20 }}>{data?.attendanceObj != "" ? HelperFunctions?.calculateWorkDuration(data?.attendanceObj?.login_time, data?.attendanceObj?.logout_time) : "00H:00M"}</Text>
                                    </View>

                                    <View style={{ marginLeft: 8, backgroundColor: '#E6F2FF', paddingVertical: 8, paddingLeft: 10, paddingRight: 25, width: '40%' }}>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: '#007AFF' }}>WORKING HOURS: </Text>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: '#007AFF', marginTop: 4 }}>{data?.attendanceObj != "" ? HelperFunctions?.formatLoggedInTime(data?.attendanceObj?.total_logged_in) : "00H:00M"}</Text>
                                    </View>
                                </View>

                                <View style={{ backgroundColor: '#E7EAF1', height: 1, marginVertical: 16 }}></View>

                                {data?.shift_data?.shift_name ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                                            <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#6F7880' }}> {data?.shift_data?.shift_name ? data?.shift_data?.shift_name + ' Shift' : ""} </Text>
                                        </View>
                                    </View> : null}

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', paddingRight: 20 }}>
                                    <View style={{ marginLeft: 8, backgroundColor: '#F0F7EF', paddingVertical: 4, paddingHorizontal: 7, marginBottom: 10 }}>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: '#60B057' }}>IN: {data?.attendanceObj?.login_time ? data?.attendanceObj?.login_time : "00H:00M"}</Text>
                                    </View>
                                    <View style={{ marginLeft: 8, backgroundColor: '#FFEFEF', paddingVertical: 4, paddingHorizontal: 7, marginBottom: 10 }}>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: '#FC6860' }}>OUT: {data?.attendanceObj?.logout_time ? data?.attendanceObj?.logout_time : "00:00"}</Text>
                                    </View>
                                    <View style={{ marginLeft: 8, backgroundColor: '#FFF6E5', paddingVertical: 4, paddingHorizontal: 7, marginBottom: 10 }}>
                                        <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: '#FFAC10' }}>BREAK: {data?.attendanceObj?.total_break_time ? HelperFunctions?.formatHours(parseFloat(data?.attendanceObj?.total_break_time)) : "00H:00M"}</Text>
                                    </View>
                                    {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 8, backgroundColor: '#F6EFFF', paddingVertical: 4, paddingHorizontal: 7, marginBottom: 10 }}>
                                    <Time color="#9C5BFF" width="13" height="13" />
                                    <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: '#9C5BFF', marginLeft: 4 }}>EARLY ARRIVAL: 40H : 00M</Text>
                                </View> */}

                                </View>
                                {data?.attendanceObj != "" && data?.attendanceObj?.break_time != "" ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 16, marginBottom: 16 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                                            <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#0E1F33' }}>Main door</Text>
                                        </View>
                                    </View>
                                    : null}

                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={data?.attendanceObj?.break_time}
                                    renderItem={breakList}
                                    contentContainerStyle={{ marginBottom: 30 }}
                                />


                                <View style={{ flexDirection: 'row' }}>
                                    {data?.yearly_holiday?.admin_hod_staff_manual_regularization == "no" && HelperFunctions.holidayDateCheck(props?.route?.params?.pdata?.yearly_holiday?.holiday_temp_data, props?.route?.params?.pdata?.year, props?.route?.params?.pdata?.formattedDate) == true ?
                                        <CustomButton
                                            isLoading={false}
                                            backgroundColor={colors.primary}
                                            buttonText="Regularize"
                                            buttonTextStyle={{ textAlign: 'center', textTransform: 'capitalize', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 - 1, lineHeight: 23 }}
                                            requireBorder={false}
                                            borderColor={colors.white}
                                            style={{ opacity: 0.5, width: '28%', borderRadius: 4, height: 35, marginTop: 16, paddingVertical: 0 }}

                                        />
                                        :
                                        <CustomButton
                                            isLoading={false}
                                            backgroundColor={colors.primary}
                                            buttonText="Regularize"
                                            buttonTextStyle={{ textAlign: 'center', textTransform: 'capitalize', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 - 1, lineHeight: 23 }}
                                            requireBorder={false}
                                            borderColor={colors.white}
                                            style={{ width: '28%', borderRadius: 8, height: 35, marginTop: 16, paddingVertical: 0 }}
                                            onPress={() => {
                                                // console.log(data)
                                                props.navigation.navigate('RegularizeShift', { pdata: data, filterParam: props?.route?.params?.filterParam })
                                            }}
                                        />
                                    }


                                </View>
                                <View style={{ backgroundColor: '#E7EAF1', height: 1, marginVertical: 16 }}></View>
                            </View> :

                            <View style={{ paddingHorizontal: 16, marginTop: 25 }}>
                                {props?.route?.params?.filterParam?.attendance_type?.value == "wholeday" ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 0 }}>
                                            <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6, color: '#4E525E' }}>Attendance status: </Text>
                                            <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: HelperFunctions.getColorCode(data?.attendanceObj?.attendance_stat).textColor, textTransform: 'uppercase' }}> {data?.attendanceObj?.attendance_stat ? data?.attendanceObj?.attendance_stat : ""}</Text>
                                        </View>
                                    </View>
                                    :
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 0 }}>
                                            <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6, color: '#4E525E' }}>Attendance status: </Text>
                                            <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: HelperFunctions.getColorCode(data?.attendanceObj?.first_half).textColor, textTransform: 'uppercase',marginTop:15 }}> <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#6F7880', textTransform: 'capitalize' }}>First half :</Text> {data?.attendanceObj?.first_half ? data?.attendanceObj?.first_half : "!"}</Text>
                                            <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: HelperFunctions.getColorCode(data?.attendanceObj?.second_half).textColor,textTransform: 'uppercase',marginTop:8 }}> <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#6F7880', textTransform: 'capitalize' }}>Second half :</Text> {data?.attendanceObj?.second_half ? data?.attendanceObj?.second_half : "!"}</Text>
                                        </View>
                                    </View>
                                }

                                <View style={{ flexDirection: 'row' }}>
                                    <CustomButton
                                        isLoading={false}
                                        backgroundColor={colors.primary}
                                        buttonText="Update Attendance"
                                        buttonTextStyle={{ textAlign: 'center', textTransform: 'capitalize', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 - 1, lineHeight: 23 }}
                                        requireBorder={false}
                                        borderColor={colors.white}
                                        style={{ width: '42%', borderRadius: 8, height: 35, marginTop: 16, paddingVertical: 0 }}
                                        onPress={() => {
                                             console.log(data)
                                            props.navigation.navigate('RegularizeShift', { pdata: data, filterParam: props?.route?.params?.filterParam })
                                        }}
                                    />
                                </View>
                            </View>





                        }
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
export default EployeeAttendanceDetails;