
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../assets/icons/Delete';
import Filter from '../assets/icons/Filter';

import Shift from '../assets/icons/Shift';
import Time from '../assets/icons/Time';
import CustomButton from '../component/CustomButton';
import FloatingDropdown from '../component/FloatingDropdown';
import FloatingTimePicker from '../component/FloatingTimePicker';
import FloatingLabelInput from '../component/FloatingLabelInput.js';
import Loader from '../component/Loader.js';

const RegularizeShift = props => {

    const dispatch = useDispatch();
    const { userDetails,companyData, token } = useSelector(state => state.project);
    const isFocused = useIsFocused();
    const route = useRoute();

    const { t, i18n } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);

    const [leaveTypes, setLeaveTypes] = useState([]);

    const [attendanceStatList_firstHalf, setAttendanceStatList_firstHalf] = useState([
        { value: 'P', description: 'P', abbreviation: 'P' },
        { value: 'A', description: 'A', abbreviation: 'A' },
        { value: 'L', description: 'L', abbreviation: 'L' },
        { value: 'H', description: 'H', abbreviation: 'H' },
        { value: 'OT', description: 'OT', abbreviation: 'OT' },
        { value: 'CSL', description: 'CSL', abbreviation: 'CSL' },
        { value: 'PVL', description: 'PVL', abbreviation: 'PVL' },
        { value: 'ERL', description: 'ERL', abbreviation: 'ERL' },
        { value: 'SKL', description: 'SKL', abbreviation: 'SKL' },
        { value: 'MDL', description: 'MDL', abbreviation: 'MDL' },
        { value: 'MTL', description: 'MTL', abbreviation: 'MTL' },
        { value: 'PTL', description: 'PTL', abbreviation: 'PTL' },
        { value: 'ANL', description: 'ANL', abbreviation: 'ANL' },
        { value: 'AWP', description: 'AWP', abbreviation: 'AWP' },
        { value: 'UWP', description: 'UWP', abbreviation: 'UWP' },
        { value: 'PDL', description: 'PDL', abbreviation: 'PDL' },
        { value: 'LE1', description: 'LE1', abbreviation: 'LE1' },
        { value: 'LE2', description: 'LE2', abbreviation: 'LE2' },
        { value: 'LP1', description: 'LP1', abbreviation: 'LP1' },
        { value: 'LP2', description: 'LP2', abbreviation: 'LP2' },
        { value: 'WO', description: 'WO', abbreviation: 'WO' },
    ])
    const [attendanceStatList_secondHalf, setAttendanceStatList_secondHalf] = useState([
        { value: 'P', description: 'P', abbreviation: 'P' },
        { value: 'A', description: 'A', abbreviation: 'A' },
        { value: 'L', description: 'L', abbreviation: 'L' },
        { value: 'H', description: 'H', abbreviation: 'H' },
        { value: 'OT', description: 'OT', abbreviation: 'OT' },
        { value: 'CSL', description: 'CSL', abbreviation: 'CSL' },
        { value: 'PVL', description: 'PVL', abbreviation: 'PVL' },
        { value: 'ERL', description: 'ERL', abbreviation: 'ERL' },
        { value: 'SKL', description: 'SKL', abbreviation: 'SKL' },
        { value: 'MDL', description: 'MDL', abbreviation: 'MDL' },
        { value: 'MTL', description: 'MTL', abbreviation: 'MTL' },
        { value: 'PTL', description: 'PTL', abbreviation: 'PTL' },
        { value: 'ANL', description: 'ANL', abbreviation: 'ANL' },
        { value: 'AWP', description: 'AWP', abbreviation: 'AWP' },
        { value: 'UWP', description: 'UWP', abbreviation: 'UWP' },
        { value: 'PDL', description: 'PDL', abbreviation: 'PDL' },
        { value: 'LE1', description: 'LE1', abbreviation: 'LE1' },
        { value: 'LE2', description: 'LE2', abbreviation: 'LE2' },
        { value: 'LP1', description: 'LP1', abbreviation: 'LP1' },
        { value: 'LP2', description: 'LP2', abbreviation: 'LP2' },
        { value: 'WO', description: 'WO', abbreviation: 'WO' },
    ])
    const [attendanceStatList, setAttendanceStatList] = useState([
        { value: 'P', description: 'P', abbreviation: 'P' },
        { value: 'A', description: 'A', abbreviation: 'A' },
        { value: 'L', description: 'L', abbreviation: 'L' },
        { value: 'H', description: 'H', abbreviation: 'H' },
        { value: 'OT', description: 'OT', abbreviation: 'OT' },
        { value: 'CSL', description: 'CSL', abbreviation: 'CSL' },
        { value: 'PVL', description: 'PVL', abbreviation: 'PVL' },
        { value: 'ERL', description: 'ERL', abbreviation: 'ERL' },
        { value: 'SKL', description: 'SKL', abbreviation: 'SKL' },
        { value: 'MDL', description: 'MDL', abbreviation: 'MDL' },
        { value: 'MTL', description: 'MTL', abbreviation: 'MTL' },
        { value: 'PTL', description: 'PTL', abbreviation: 'PTL' },
        { value: 'ANL', description: 'ANL', abbreviation: 'ANL' },
        { value: 'AWP', description: 'AWP', abbreviation: 'AWP' },
        { value: 'UWP', description: 'UWP', abbreviation: 'UWP' },
        { value: 'PDL', description: 'PDL', abbreviation: 'PDL' },
        { value: 'LE1', description: 'LE1', abbreviation: 'LE1' },
        { value: 'LE2', description: 'LE2', abbreviation: 'LE2' },
        { value: 'LP1', description: 'LP1', abbreviation: 'LP1' },
        { value: 'LP2', description: 'LP2', abbreviation: 'LP2' },
        { value: 'WO', description: 'WO', abbreviation: 'WO' },
    ])
    const [loginTime, setLoginTime] = useState("");
    const [logoutTime, setLogoutTime] = useState("");
    const [breakTime, setBreakTime] = useState("");
    const [selectedLeaveType, setSelectedLeaveType] = useState({ label: '', value: '' });
    const [partialLeaveTime, setPartialLeaveTime] = useState("");
    const [firstHalf, setFirstHalf] = useState(""); // For Half day
    const [secondHalf, setSecondHalf] = useState(""); // For half day
    const [attendanceStatus, setAttendanceStatus] = useState(""); // for fullday


    const [data, setData] = useState("")

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL)

        }
    }, [isFocused]);


    useEffect(() => {
        if (props?.route?.params) {
            console.log("paramData for regularize===>")
            console.log(props?.route?.params?.pdata);
            setData(props?.route?.params?.pdata);
            console.log(HelperFunctions.getLeaveTypes(props?.route?.params?.filterParam?.attendance_type?.value))
            setLeaveTypes(HelperFunctions.getLeaveTypes(props?.route?.params?.filterParam?.attendance_type?.value));
        }
    }, []);

    useEffect(() => {
        if (data != "") {
            if (data?.attendanceObj != "") {

                setLoginTime(data?.attendanceObj?.login_time)
                setLogoutTime(data?.attendanceObj?.logout_time ? data?.attendanceObj?.logout_time : null)
                setBreakTime(data?.attendanceObj?.total_break_time);
                setPartialLeaveTime(data?.attendanceObj?.partial_leave);

                setSecondHalf(data?.attendanceObj?.second_half);

                let selectedLeaveTypeOption = { label: HelperFunctions.removeUnderScore(data?.attendanceObj?.leave_type), value: data?.attendanceObj?.leave_type }

                let templdata = HelperFunctions.copyArrayOfObj(leaveTypes);
                for (let k = 0; k < templdata.length; k++) {
                    if (templdata[k].value == selectedLeaveTypeOption.value) {
                        templdata[k].selected = templdata[k].selected == true ? false : true;
                        setSelectedLeaveType(templdata[k])
                    } else {
                        templdata[k].selected = false;
                    }
                }
                setLeaveTypes(templdata)
                setSelectedLeaveType(selectedLeaveTypeOption)




                let firstHalf = { value: data?.attendanceObj?.first_half, description: data?.attendanceObj?.first_half, abbreviation: data?.attendanceObj?.first_half }
                let firstHalfAttendanceStat = HelperFunctions.copyArrayOfObj(attendanceStatList_firstHalf);

                for (let a = 0; a < firstHalfAttendanceStat.length; a++) {
                    if (firstHalfAttendanceStat[a].value == firstHalf.value) {
                        firstHalfAttendanceStat[a].selected = firstHalfAttendanceStat[a].selected == true ? false : true;
                        setFirstHalf(firstHalfAttendanceStat[a])
                    } else {
                        firstHalfAttendanceStat[a].selected = false;
                    }
                }
                setAttendanceStatList_firstHalf(firstHalfAttendanceStat);
                setFirstHalf(firstHalf)
            }


            let secondHalf = { value: data?.attendanceObj?.second_half, description: data?.attendanceObj?.second_half, abbreviation: data?.attendanceObj?.second_half }

            let secondHalfAttendanceStat = HelperFunctions.copyArrayOfObj(attendanceStatList_secondHalf);

            for (let b = 0; b < secondHalfAttendanceStat.length; b++) {
                if (secondHalfAttendanceStat[b].value == secondHalf.value) {
                    secondHalfAttendanceStat[b].selected = secondHalfAttendanceStat[b].selected == true ? false : true;
                    setSecondHalf(secondHalfAttendanceStat[b])
                } else {
                    secondHalfAttendanceStat[b].selected = false;
                }
            }
            setAttendanceStatList_secondHalf(secondHalfAttendanceStat);
            setSecondHalf(secondHalf);



            if (data?.attendanceObj?.leave_type == "full_day") {
                let seletedAttStat = { value: data?.attendanceObj?.attendance_stat, description: data?.attendanceObj?.attendance_stat, abbreviation: data?.attendanceObj?.attendance_stat }
                let tempAtData = HelperFunctions.copyArrayOfObj(attendanceStatList);

                for (let a = 0; a < tempAtData.length; a++) {
                    if (tempAtData[a].value == seletedAttStat.value) {
                        tempAtData[a].selected = tempAtData[a].selected == true ? false : true;
                    } else {
                        tempAtData[a].selected = false;
                    }
                }
                setAttendanceStatList(tempAtData);
                setAttendanceStatus(seletedAttStat)
            }
        }



    }, [data]);


    const updateAttendanceStatus = () => {
        let firstHalf = { value: data?.attendanceObj?.first_half, description: data?.attendanceObj?.first_half, abbreviation: data?.attendanceObj?.first_half }
        let firstHalfAttendanceStat = HelperFunctions.copyArrayOfObj(attendanceStatList_firstHalf);

        for (let a = 0; a < firstHalfAttendanceStat.length; a++) {
            if (firstHalfAttendanceStat[a].value == firstHalf.value) {
                firstHalfAttendanceStat[a].selected = firstHalfAttendanceStat[a].selected == true ? false : true;
                setFirstHalf(firstHalfAttendanceStat[a])
            } else {
                firstHalfAttendanceStat[a].selected = false;
            }
        }
        setAttendanceStatList_firstHalf(firstHalfAttendanceStat);
        setFirstHalf(firstHalf);



        let secondHalf = { value: data?.attendanceObj?.second_half, description: data?.attendanceObj?.second_half, abbreviation: data?.attendanceObj?.second_half }

        let secondHalfAttendanceStat = HelperFunctions.copyArrayOfObj(attendanceStatList_secondHalf);

        for (let b = 0; b < secondHalfAttendanceStat.length; b++) {
            if (secondHalfAttendanceStat[b].value == secondHalf.value) {
                secondHalfAttendanceStat[b].selected = secondHalfAttendanceStat[b].selected == true ? false : true;
                setSecondHalf(secondHalfAttendanceStat[b])
            } else {
                secondHalfAttendanceStat[b].selected = false;
            }
        }
        setAttendanceStatList_secondHalf(secondHalfAttendanceStat);
        setSecondHalf(secondHalf);



        if (data?.attendanceObj?.leave_type == "full_day") {
            let seletedAttStat = { value: data?.attendanceObj?.attendance_stat, description: data?.attendanceObj?.attendance_stat, abbreviation: data?.attendanceObj?.attendance_stat }
            let tempAtData = HelperFunctions.copyArrayOfObj(attendanceStatList);

            for (let a = 0; a < tempAtData.length; a++) {
                if (tempAtData[a].value == seletedAttStat.value) {
                    tempAtData[a].selected = tempAtData[a].selected == true ? false : true;
                } else {
                    tempAtData[a].selected = false;
                }
            }
            setAttendanceStatList(tempAtData);
            setAttendanceStatus(seletedAttStat)
        }
    }

    const updateAttendance = () => {
        if (!selectedLeaveType) {
            HelperFunctions.showToastMsg("Please select leave type");
        } else if (selectedLeaveType?.value == "partial_day" && !partialLeaveTime) {
            HelperFunctions.showToastMsg("Please enter partial leave time");
        } else if (selectedLeaveType?.value == "partial_day" && partialLeaveTime > 480) {
            HelperFunctions.showToastMsg("Partial leave time can\'t be greater 480 min");
        } else if (props?.route?.params?.filterParam?.attendance_type?.value == "time" && !loginTime) {
            HelperFunctions.showToastMsg("Please choose login time");
        } else if (props?.route?.params?.filterParam?.attendance_type?.value == "time" && !logoutTime) {
            HelperFunctions.showToastMsg("Please choose logout time");
        } else if (props?.route?.params?.filterParam?.attendance_type?.value == "time" && !breakTime) {
            HelperFunctions.showToastMsg("Please enter break time");
        } else if (selectedLeaveType?.value == "full_day" && !attendanceStatus?.value) {
            HelperFunctions.showToastMsg("Please choose attendance status");
        } else if (selectedLeaveType?.value == "half_day" && (!firstHalf || firstHalf.value == undefined)) {
            HelperFunctions.showToastMsg("Please choose first half attendance type");
        } else if (selectedLeaveType?.value == "half_day" && (!secondHalf || secondHalf.value == undefined)) {
            HelperFunctions.showToastMsg("Please choose second half attendance type");
        } else {
            setIsLoading(true)
                let param = {
                    "emp_id": data?.emp_id,
                    "login_time": loginTime ,
                    "logout_time": logoutTime,
                    "total_break_time": breakTime != undefined ? breakTime : '0.0',
                    "total_logged_in": loginTime != undefined && logoutTime != undefined && breakTime != undefined ?  HelperFunctions.calculateWorkingHours(loginTime, logoutTime, breakTime)?.rawHours : "0.0",
                    "leave_type": selectedLeaveType?.value,
                    "first_half": firstHalf?.value,
                    "second_half": secondHalf?.value,
                    "attendance_stat": selectedLeaveType?.value == "full_day" ? attendanceStatus?.value : "",
                    "partial_leave": partialLeaveTime,
                    "register_type": props?.route?.params?.filterParam?.attendance_type?.value,
                    "attendance_date": data?.formattedDate
                }
                console.log(param)
                updateAttendanceAPI(param);
            // if (props?.route?.params?.filterParam?.attendance_type?.value == "time") {
            //     let param = {
            //         "emp_id": data?.emp_id,
            //         "login_time": loginTime,
            //         "logout_time": logoutTime,
            //         "total_break_time": breakTime,
            //         "total_logged_in": HelperFunctions.calculateWorkingHours(loginTime, logoutTime, breakTime)?.rawHours,
            //         "leave_type": selectedLeaveType?.value,
            //         "first_half": firstHalf?.value,
            //         "second_half": secondHalf?.value,
            //         "attendance_stat": selectedLeaveType?.value == "full_day" ? attendanceStatus?.value : "",
            //         "partial_leave": partialLeaveTime,
            //         "register_type": props?.route?.params?.filterParam?.attendance_type?.value,
            //         "attendance_date": data?.formattedDate
            //     }
            //     updateAttendanceAPI(param);
            // } else {
            //     let param = {
            //         "emp_id": data?.emp_id,
            //         "total_break_time": 0,
            //         "total_logged_in": "0.0",
            //         "leave_type": selectedLeaveType?.value,
            //         "attendance_stat": "",
            //         "register_type": props?.route?.params?.filterParam?.attendance_type?.value,
            //         "attendance_date": data?.formattedDate
            //     }
            //     // updateAttendanceAPI(param);
            //     console.log(param)
            // }


        }

        updateAttendanceAPI = (param) => {
            postApi("company/update-attendance-data", param, token)
                .then((resp) => {
                    if (resp?.status == 'success') {
                        setIsLoading(false);
                        HelperFunctions.showToastMsg(resp.message);
                        props.navigation.goBack()
                    } else {
                        HelperFunctions.showToastMsg(resp.message);
                        setIsLoading(false)
                    }
                }).catch((err) => {
                    console.log(err);
                    setIsLoading(false)
                    HelperFunctions.showToastMsg(err.message);
                })
        }
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={t('Regularize')}
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
                        <View style={{ paddingHorizontal: 16, marginTop: 25, }}>
                            {props?.route?.params?.filterParam?.attendance_type?.value == "time" ?
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Time width="27" height="27" color="#007AFF" />
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 6 }}>
                                            <Text style={{ fontFamily: FontFamily.semibold, fontSize: sizes.h1 + 1, color: '#474846' }}>{HelperFunctions.calculateWorkingHours(loginTime, logoutTime, breakTime)?.displayHours}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#6F7880', marginTop: 6, marginLeft: 0 }}>Total Logged In</Text>
                                </View> : null}

                            {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 20, marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, fontSize: sizes.h6 - 1, color: '#4E525E' }}>Morning Shift (10:00 AM - 02:00 PM):</Text>
                                    <Text style={{ fontFamily: FontFamily.semibold, fontSize: sizes.h4, color: '#60B057', marginLeft: 4 }}>03.40h</Text>
                                </View>
                            </View> */}

                            <FloatingDropdown
                                multiSelect={false}
                                labelName="Leave Type"
                                selectedValueData={selectedLeaveType?.value != "" ? selectedLeaveType : ""}
                                options={leaveTypes}
                                listLabelKeyName={['label']}
                                onSelect={(option) => {
                                    let data = HelperFunctions.copyArrayOfObj(leaveTypes);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k].value == option.value) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            setSelectedLeaveType(data[k])
                                        } else {
                                            data[k].selected = false;
                                        }
                                    }

                                    setLeaveTypes(data);

                                    if (option.value == "full_day") {

                                        if (data?.attendanceObj?.attendance_stat != "" || data?.attendanceObj?.attendance_stat != null) {
                                            let seletedAttStat = { value: data?.attendanceObj?.attendance_stat, description: data?.attendanceObj?.attendance_stat, abbreviation: data?.attendanceObj?.attendance_stat }

                                            let tempAtData = HelperFunctions.copyArrayOfObj(attendanceStatList);

                                            for (let a = 0; a < tempAtData.length; a++) {
                                                if (tempAtData[a].value == seletedAttStat.value) {
                                                    tempAtData[a].selected = tempAtData[a].selected == true ? false : true;
                                                } else {
                                                    tempAtData[a].selected = false;
                                                }
                                            }
                                            setAttendanceStatList(tempAtData);
                                            setAttendanceStatus(seletedAttStat)
                                            setFirstHalf(tempAtData);
                                            setSecondHalf(tempAtData);
                                        } else {
                                            setFirstHalf("");
                                            setSecondHalf("");
                                            setAttendanceStatus("")
                                        }

                                    } else if (option.value == "half_day") {
                                        updateAttendanceStatus();
                                    } else {
                                        setFirstHalf({ value: "P" });
                                        setSecondHalf({ value: "P" });

                                    }
                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor="#5A5B5B"
                                inputMargin={20}
                                bottomMargin={20}
                            />
                            {selectedLeaveType?.value == "partial_day" ?
                                <FloatingLabelInput
                                    labelColor="#6F7880"
                                    labelBg="#fff"
                                    inputColor="#5A5B5B"
                                    placeholderColor="#8A8E9C"
                                    inputContainerColor={partialLeaveTime != "" ? "#60B057" : "#CACDD4"}
                                    //top={20}
                                    marginBottom={4}
                                    label="Partial Time (In Minute)"
                                    placeholder="Max 480 min"
                                    value={partialLeaveTime != null ? partialLeaveTime.toString() : partialLeaveTime}
                                    onChangeText={setPartialLeaveTime}
                                />
                                : null}


                            {props?.route?.params?.filterParam?.attendance_type?.value == "time" ? <>
                                <FloatingTimePicker
                                    editableStatus={true}
                                    labelName={'Login Time-(' + data?.shift_data?.shift1_start_time + ')'}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                    //selectedValue={loginTime}
                                    inputMargin={20}
                                    confirmDateClick={(time) => {
                                        //setLoginTime(HelperFunctions.get24HourTime(data))
                                        const dateString = time.toString();
                                        // Create a Date object from the string
                                        const date = new Date(dateString);
                                        // Extract the time components
                                        const hours = date.getHours().toString().padStart(2, '0');
                                        const minutes = date.getMinutes().toString().padStart(2, '0');
                                        // Format the time as HH:MM:SS
                                        const timeString = `${hours}:${minutes}`;
                                        console.log(timeString);
                                        setLoginTime(timeString)
                                    }}
                                />


                                <FloatingTimePicker
                                    editableStatus={true}
                                    labelName={'Logout Time-(' + data?.shift_data?.shift1_end_time + ')'}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    selectedValue={logoutTime ? HelperFunctions.convertTo12HourFormat(logoutTime) : ""}
                                    //selectedValue={loginTime}
                                    inputMargin={20}
                                    confirmDateClick={(time) => {
                                        //setLoginTime(HelperFunctions.get24HourTime(data))
                                        const dateString = time.toString();
                                        // Create a Date object from the string
                                        const date = new Date(dateString);
                                        // Extract the time components
                                        const hours = date.getHours().toString().padStart(2, '0');
                                        const minutes = date.getMinutes().toString().padStart(2, '0');
                                        // Format the time as HH:MM:SS
                                        const timeString = `${hours}:${minutes}`;
                                        console.log(timeString);
                                        setLogoutTime(timeString)
                                    }}
                                />

                                <FloatingLabelInput
                                    labelColor="#6F7880"
                                    labelBg="#fff"
                                    inputColor="#5A5B5B"
                                    placeholderColor="#8A8E9C"
                                    inputContainerColor={breakTime != "" ? "#60B057" : "#CACDD4"}
                                    top={20}
                                    label="Break (in hour)"
                                    placeholder="Total break time"
                                    value={breakTime}
                                    onChangeText={setBreakTime}
                                />
                            </> : null}

                            {selectedLeaveType?.value == "half_day" ? <>
                                <FloatingDropdown
                                 textTransform='uppercase'
                                    multiSelect={false}
                                    labelName="First half"
                                    selectedValueData={firstHalf != "" && firstHalf.value != undefined ? firstHalf : ""}
                                    options={attendanceStatList_firstHalf}
                                    listLabelKeyName={['value']}
                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(attendanceStatList_firstHalf);
                                        for (let l = 0; l < data.length; l++) {
                                            if (data[l].value == option.value) {
                                                data[l].selected = data[l].selected == true ? false : true;
                                                setFirstHalf(data[l])
                                            } else {
                                                data[l].selected = false;
                                            }
                                        }

                                        setAttendanceStatList_firstHalf(data)
                                    }}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    inputMargin={0}
                                    bottomMargin={20}
                                />
                                <FloatingDropdown
                                 textTransform='uppercase'
                                    multiSelect={false}
                                    labelName="Second Half"
                                    selectedValueData={secondHalf != "" && secondHalf.value != undefined ? secondHalf : ""}
                                    options={attendanceStatList_secondHalf}
                                    listLabelKeyName={['value']}
                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(attendanceStatList_secondHalf);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k].value == option.value) {
                                                data[k].selected = data[k].selected == true ? false : true;
                                                setSecondHalf(data[k])
                                            } else {
                                                data[k].selected = false;
                                            }
                                        }

                                        setAttendanceStatList_secondHalf(data)
                                    }}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    inputMargin={0}
                                    bottomMargin={20}
                                />
                            </> : null}



                            {selectedLeaveType?.value == "full_day" ?
                                <FloatingDropdown
                                    textTransform='uppercase'
                                    multiSelect={false}
                                    labelName="Status"
                                    selectedValueData={attendanceStatus?.value != undefined ? attendanceStatus : ""}
                                    options={attendanceStatList}
                                    listLabelKeyName={['value']}
                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(attendanceStatList);
                                        for (let m = 0; m < data.length; m++) {
                                            if (data[m].value == option.value) {
                                                data[m].selected = data[m].selected == true ? false : true;
                                                setAttendanceStatus(data[m]);
                                                setFirstHalf(data[m]);
                                                setSecondHalf(data[m]);
                                            } else {
                                                data[m].selected = false;
                                            }
                                        }

                                        setAttendanceStatList(data);

                                    }}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    //inputMargin={props?.route?.params?.filterParam?.attendance_type?.value == "wholeday" ? 20 : 0}
                                    bottomMargin={20}
                                /> : null}

                            <View style={{ flexDirection: 'row' }}>
                                <CustomButton
                                    isLoading={isLoading}
                                    backgroundColor={colors.primary}
                                    buttonText="SUBMIT"
                                    buttonTextStyle={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 - 1, lineHeight: 23 }}
                                    requireBorder={false}
                                    borderColor={colors.white}
                                    style={{ width: '100%', borderRadius: 8, marginTop: 16, paddingVertical: 0 }}
                                    onPress={() => {
                                        updateAttendance()
                                    }}
                                />
                            </View>
                            <View style={{ backgroundColor: '#E7EAF1', height: 1, marginVertical: 16 }}></View>

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
export default RegularizeShift;