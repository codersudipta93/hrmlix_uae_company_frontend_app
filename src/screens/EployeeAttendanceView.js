
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
import Loader from '../component/Loader.js';

const EployeeAttendanceView = props => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { userDetails, token } = useSelector(state => state.project);

    const isFocused = useIsFocused();
    const route = useRoute();

    const { t, i18n } = useTranslation();
    const [monthCalenderData, setmonthCalenderData] = useState([]);

    //const [attendanceData, setAttedancedata] = usestate()
    const [empData, setempData] = useState("");
    const [filterdata, setFilterData] = useState(null);

    const [loadingStatus, setLoadingStaus] = useState(false)

    const { onGoBack } = route.params || {}; // Retrieve the callback function

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL)
        }
    }, [isFocused]);


    useEffect(() => {
        if (isFocused == true) {

            if (props?.route?.params) {
                console.log("paramData ===>")
                console.log(props?.route?.params);
                setempData(props?.route?.params?.empData);

                if (props?.route?.params?.filterdata) {

                    let previousPageFilterData = props?.route?.params?.filterdata;
                    updateData(previousPageFilterData)
                    setFilterData(previousPageFilterData);
                }

            }
        }

    }, [isFocused]);



    updateData = (filterdata2) => {
        let previousPageFilterData = filterdata2;
        //let previousPageFilterData = { ...filterdata };
        //alert(props?.route?.params?.empData?.emp_id)
        let pData = {
            "pageno": 1,
            "search_month": previousPageFilterData?.search_month?.value,
            "search_year": previousPageFilterData?.search_year?.value,
            //"search_day": previousPageFilterData?.search_day,
            "attendance_type": previousPageFilterData?.attendance_type ? previousPageFilterData?.attendance_type?.value : 'time',
            "branch_id": (previousPageFilterData?.branchData != "" && previousPageFilterData?.branchData != "[]") ? previousPageFilterData?.branchData : "",
            "designation_id": previousPageFilterData?.designationData != "" && previousPageFilterData?.designationData != "[]" ? previousPageFilterData?.designationData : "",
            "department_id": previousPageFilterData?.departmentData != "" && previousPageFilterData?.departmentData != "[]" ? previousPageFilterData?.departmentData : "",
            "hod_id": previousPageFilterData?.hodData != "" && previousPageFilterData?.hodData != "[]" ? previousPageFilterData?.hodData : "",
            "client_id": previousPageFilterData?.clientData != "" && previousPageFilterData?.clientData != "[]" ? previousPageFilterData?.clientData : "",
            "searchkey": props?.route?.params?.empData?.emp_id
        }

        if (pData) {
            setLoadingStaus(true)
            postApi("company/get-attendance-data", pData, token)
                .then((resp) => {
                    console.log(JSON.stringify(resp));
                    if (resp?.status == 'success') {


                        if (resp?.employees?.docs != "") {
                            setempData(resp?.employees?.docs[0]);

                            let resData = resp?.employees?.docs[0]
                            if (resData != "") {
                                if (previousPageFilterData?.attendance_type?.value == 'monthly') {
                                    setmonthCalenderData(resData?.attendance);
                                    setLoadingStaus(false);
                                } else {
                                    let datesAndDays = HelperFunctions.getAllDatesAndDays(parseInt(previousPageFilterData?.search_month?.value), previousPageFilterData?.search_year?.value);
                                    let attendance = resData?.attendance;

                                    //console.log(datesAndDays)
                                    console.log("attendance======>", attendance)
                                    for (let i = 0; i < datesAndDays.length; i++) {
                                        for (let a = 0; a < attendance.length; a++) {
                                            if (datesAndDays[i].formattedDate == attendance[a].attendance_date) {
                                                datesAndDays[i].attendanceObj = attendance[a];
                                                datesAndDays[i].shift = resData?.shift ? resData?.shift : "";
                                                datesAndDays[i].shift_data = resData?.shift_data ? resData?.shift_data : "";
                                                datesAndDays[i].emp_id = resData?.emp_id;
                                                datesAndDays[i].emp_first_name = resData?.emp_first_name;
                                                datesAndDays[i].emp_last_name = resData?.emp_last_name;
                                                datesAndDays[i].profile_pic = resData?.profile_pic;
                                                datesAndDays[i].yearly_holiday = resData?.yearly_holiday ? resData?.yearly_holiday : "";
                                            }
                                        }
                                    }

                                    setmonthCalenderData(datesAndDays);
                                    setLoadingStaus(false);
                                }

                            }
                        } else {
                            setLoadingStaus(false);
                            if (previousPageFilterData?.attendance_type?.value == 'monthly') {
                                setmonthCalenderData("");
                                setLoadingStaus(false);
                            }
                        }
                    } else {
                        HelperFunctions.showToastMsg(resp.message);
                        setLoadingStaus(false)
                        //setIsLoading(false)
                    }

                }).catch((err) => {
                    console.log(err);
                    setLoadingStaus(false)
                    HelperFunctions.showToastMsg(err.message);
                })
        } else {
            setLoadingStaus(false)
        }
    }
    //}, [filterdata])

    const _openFilter = () => {
        let pData = {
            "pageno": 1,
            "search_month": filterdata?.search_month,
            "search_year": filterdata?.search_year,
            "attendance_type": filterdata?.attendance_type,
            "branchData": props?.route?.params?.paramData?.branchData ? props?.route?.params?.paramData?.branchData : [],
            "designationData": props?.route?.params?.paramData?.designationData ? props?.route?.params?.paramData?.designationData : [],
            "departmentData": props?.route?.params?.paramData?.departmentData ? props?.route?.params?.paramData?.departmentData : [],
            "hodData": props?.route?.params?.paramData?.hodData ? props?.route?.params?.paramData?.hodData : [],
            "clientData": props?.route?.params?.paramData?.clientData ? props?.route?.params?.paramData?.clientData : [],
            //"search_day": filterdata?.search_day,
            // "searchkey":""
        }

        console.log("filter data paramData ====> ", pData)
        console.log("filter data paramData ======================= ", empData)
        props.navigation.navigate('FilterEmployeePage', { paramData: pData, from: 'attendanceView_page', empData: empData })
    }


    const ListRender = ({ index, item }) => (
        <View style={{ paddingTop: index == 0 ? 12 : 8, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>

            <View style={{ paddingRight: 0, paddingLeft: 12, paddingRight: 12 }}>
                <View style={{ backgroundColor: colors.white, flex: 1, borderRadius: 4, flexDirection: 'column', justifyContent: 'flex-stat', alignItems: 'center' }}>
                    <Text style={{ letterSpacing: 0.4, color: '#8A8E9C', fontFamily: FontFamily.regular, fontSize: sizes.md + 1 }}>{HelperFunctions.getMonthName(item.month - 1)}</Text>
                    <Text style={{ letterSpacing: 0.4, color: '#4E525E', fontFamily: FontFamily.bold, fontSize: sizes.h5, paddingVertical: 2 }}>{item.date ? item.date <= 9 ? 0 : null : null}{item.date}</Text>
                    <Text style={{ letterSpacing: 0.4, color: '#8A8E9C', fontFamily: FontFamily.regular, fontSize: sizes.md + 1 }}>{item.dayName}</Text>
                </View>
            </View>

            <View style={{ flex: 1, paddingRight: 12 }}>
                {item?.attendanceObj ? <Pressable onPress={() => {
                    props.navigation.navigate('EployeeAttendanceDetails', { pdata: item, filterParam: filterdata })
                    // console.log(item)
                }}>
                    {item?.attendanceObj?.leave_type == 'present' || item?.attendanceObj?.leave_type == 'full_day' || item?.attendanceObj?.leave_type == "partial_day" ?
                        <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md, paddingLeft: 8 }}>{HelperFunctions.getTypeFullName(item?.attendanceObj?.first_half, true)}</Text>
                            </View>
                        </View>
                        :
                        <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', paddingRight: 12 }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md, paddingLeft: 8 }}>{HelperFunctions.getTypeFullName(item?.attendanceObj?.first_half, false)}</Text>
                                <Shift />
                            </View>
                            <View style={{ marginTop: 5, backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.second_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', paddingRight: 12 }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.second_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md, paddingLeft: 8 }}>{HelperFunctions.getTypeFullName(item?.attendanceObj?.second_half, false)}</Text>
                                <Shift />
                            </View>
                        </View>
                    }
                </Pressable> :
                    <Pressable onPress={() => {

                        let resData = empData;
                        let pData = item;

                        pData.attendanceObj = [];
                        pData.shift = resData?.shift ? resData?.shift : "";
                        pData.shift_data = resData?.shift_data ? resData?.shift_data : "";
                        pData.emp_id = resData?.emp_id;
                        pData.emp_first_name = resData?.emp_first_name;
                        pData.emp_last_name = resData?.emp_last_name;
                        pData.profile_pic = resData?.profile_pic;
                        pData.yearly_holiday = resData?.yearly_holiday ? resData?.yearly_holiday : "";

                        console.log(pData)
                        props.navigation.navigate('EployeeAttendanceDetails', { pdata: pData, filterParam: filterdata });
                    }} style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View style={{ backgroundColor: '#fff3de', width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: '#FFAC10', fontFamily: FontFamily.medium, fontSize: sizes.md, lineHeight: 16, paddingLeft: 8 }}>No Entry Log</Text>
                        </View>
                    </Pressable>
                }
            </View>
        </View>
    );


    const HDListRender = ({ index, item }) => (
        <View  style={{ paddingTop: index == 0 ? 12 : 8, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>

            <View style={{ paddingRight: 0, paddingLeft: 12, paddingRight: 12 }}>
                <View style={{ backgroundColor: colors.white, flex: 1, borderRadius: 4, flexDirection: 'column', justifyContent: 'flex-stat', alignItems: 'center' }}>
                    <Text style={{ letterSpacing: 0.4, color: '#8A8E9C', fontFamily: FontFamily.regular, fontSize: sizes.md + 1 }}>{HelperFunctions.getMonthName(item.month - 1)}</Text>
                    <Text style={{ letterSpacing: 0.4, color: '#4E525E', fontFamily: FontFamily.bold, fontSize: sizes.h5, paddingVertical: 2 }}>{item.date ? item.date <= 9 ? 0 : null : null}{item.date}</Text>
                    <Text style={{ letterSpacing: 0.4, color: '#8A8E9C', fontFamily: FontFamily.regular, fontSize: sizes.md + 1 }}>{item.dayName}</Text>
                </View>
            </View>

            <View style={{ flex: 1, paddingRight: 12 }}>
                {item?.attendanceObj ? <Pressable onPress={() => {
                        console.log(item)
                       props.navigation.navigate('EployeeAttendanceDetails', { pdata: item, filterParam: filterdata }) 
                    
                    }}>

                    <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View style={{ backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).bgColor, width: '100%', borderRadius: 8, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', paddingRight: 12 }}>
                            <View style={{ height: 50, width: '15%', backgroundColor: HelperFunctions.adjustColorContrast(HelperFunctions.getColorCode(item?.attendanceObj?.first_half).bgColor, -30), borderTopLeftRadius: 8, borderBottomLeftRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: '#2E2E2E', fontFamily: FontFamily.semibold, fontSize: sizes.md, }}>H1</Text>
                            </View>
                            <View style={{ width: '85%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md, paddingLeft: 8 }}>{HelperFunctions.getTypeFullName(item?.attendanceObj?.first_half, false)}</Text>
                                <Shift />
                            </View>
                        </View>
                        <View style={{ marginTop: 5, backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.second_half).bgColor, width: '100%', borderRadius: 8, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingRight: 12 }}>
                            <View style={{ height: 50, width: '15%', backgroundColor: HelperFunctions.adjustColorContrast(HelperFunctions.getColorCode(item?.attendanceObj?.second_half).bgColor, -20), borderTopLeftRadius: 8, borderBottomLeftRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: '#2E2E2E', fontFamily: FontFamily.semibold, fontSize: sizes.md, }}>H2</Text>
                            </View>
                            <View style={{ width: '85%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.second_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md, paddingLeft: 8 }}>{HelperFunctions.getTypeFullName(item?.attendanceObj?.second_half, false)}</Text>
                                <Shift />
                            </View>
                        </View>
                    </View>

                </Pressable> :
                    <Pressable onPress={() => {

                        let resData = empData;
                        let pData = item;

                        pData.attendanceObj = [];
                        pData.shift = resData?.shift ? resData?.shift : "";
                        pData.shift_data = resData?.shift_data ? resData?.shift_data : "";
                        pData.emp_id = resData?.emp_id;
                        pData.emp_first_name = resData?.emp_first_name;
                        pData.emp_last_name = resData?.emp_last_name;
                        pData.profile_pic = resData?.profile_pic;
                        pData.yearly_holiday = resData?.yearly_holiday ? resData?.yearly_holiday : "";

                        console.log(pData)
                        props.navigation.navigate('EployeeAttendanceDetails', { pdata: pData, filterParam: filterdata });
                    }}style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View style={{ backgroundColor: '#fff3de', width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: '#FFAC10', fontFamily: FontFamily.medium, fontSize: sizes.md, lineHeight: 16, paddingLeft: 8 }}>No Entry Log</Text>
                        </View>
                    </Pressable>
                }
            </View>
        </View>
    );


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
                    backClick={() => {
                        navigation.goBack();
                    }}
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 0 }}>
                        <View style={{ borderWidth: 1, paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E2538' }}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ marginRight: 12 }}>
                                    <Image source={{ uri: 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: 35, width: 35, borderRadius: 50, objectFit: 'cover' }} />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: colors.white, fontSize: sizes.h6 }}>{empData?.emp_first_name} {empData?.emp_last_name}</Text>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#C8C8C8', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>ID: {empData?.emp_id}</Text>
                                    <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
                                        <Image
                                            style={{
                                                height: 14,
                                                width: 14,
                                                tintColor: '#C8C8C8',
                                            }}
                                            source={LOCAL_ICONS.calender}
                                        />
                                        <Text style={{ marginLeft: 4, fontFamily: FontFamily.medium, color: '#C8C8C8', fontSize: sizes.md, textTransform: 'uppercase' }}>{HelperFunctions.getMonthName(filterdata?.search_month?.value)}, {filterdata?.search_year?.value}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { _openFilter() }} style={{ padding: 6, paddingHorizontal: 10 }}>
                                <Filter color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingHorizontal: 14 }}>
                            {monthCalenderData != "" && (filterdata?.attendance_type?.value == "time" || filterdata?.attendance_type?.value == "wholeday") ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={monthCalenderData}
                                    renderItem={ListRender}
                                    contentContainerStyle={{ marginBottom: 30 }}
                                />
                                : null}

                            {monthCalenderData != "" && filterdata?.attendance_type?.value == "halfday" ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={monthCalenderData}
                                    renderItem={HDListRender}
                                    contentContainerStyle={{ marginBottom: 30 }}
                                />
                                : null}

                            {filterdata?.attendance_type?.value == "monthly" ?
                                <View>
                                    <View style={styles.monthlyViewHeaderContainer}>
                                        <Text style={styles.monthlyHeader}>Employee Attendance Details</Text>
                                        <TouchableOpacity style={{ marginRight: 11 }} onPress={()=>{
                                            props.navigation.navigate('EditMonthlyAttendanceDetails', { empData: empData, filterdata: filterdata, attendanceData:monthCalenderData[0]?.monthly_attendance })
                                        }}>
                                            <IonIcon
                                                name="create"
                                                size={22}
                                                color="#8A8E9C"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Pay Days</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.paydays}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total Absent</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_absent}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total Attendance</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_attendance}</Text>
                                        </View>
                                    </View>


                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total CL</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_cl}</Text>
                                        </View>
                                    </View>


                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total GL</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_gl}</Text>
                                        </View>
                                    </View>


                                    <View style={styles.listContainer}>
                                        <View> 
                                            <Text style={styles.optionname}>Total HL</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_hl}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total KB</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_kb}</Text>
                                        </View> 
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total LOP</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_lop}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total ML</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_ml}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total Overtime</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_overtime}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total PL</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_pl}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Adjust Days</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_absent}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total Late</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_late}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Total Weekly Off</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{monthCalenderData[0]?.monthly_attendance?.total_wo}</Text>
                                        </View>
                                    </View>


                                </View>
                                : null}
                        </View>
                    </View>
                </ScrollView>
                <Loader isLoading={loadingStatus} />
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
    },
    monthlyViewHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    monthlyHeader: { fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 21 },
    listContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E7EAF1', paddingVertical: 12 },
    optionname: { color: '#868F9A', fontFamily: FontFamily.medium, fontSize: 12 },
    optionVal: { color: '#4E525E', fontFamily: FontFamily.medium, fontSize: 14 }
});
export default EployeeAttendanceView;