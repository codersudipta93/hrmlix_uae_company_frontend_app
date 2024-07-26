
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
import Attendance from './TabScreens/Attendance';
import Shift from '../assets/icons/Shift';

const EployeeAttendanceView = props => {

    const dispatch = useDispatch();
    const { userDetails, token } = useSelector(state => state.project);

    const isFocused = useIsFocused();
    const route = useRoute();

    const { t, i18n } = useTranslation();
    const [monthCalenderData, setmonthCalenderData] = useState([]);

    //const [attendanceData, setAttedancedata] = usestate()
    const [empData, setempData] = useState("");
    const [filterdata, setFilterData] = useState("");

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL)
        }
    }, [isFocused]);


    useEffect(() => {

        if (props?.route?.params) {
            console.log("paramData ===>")
            console.log(props?.route?.params?.paramData);
            setempData(props?.route?.params?.empData);
            setFilterData(props?.route?.params?.filterdata);
        }

       
        // let datesAndDays = HelperFunctions.getAllDatesAndDays(parseInt(props?.route?.params?.filterdata?.search_month), props?.route?.params?.filterdata?.search_year);

        // let attendance = props?.route?.params?.paramData?.attendance
        // for (let i = 0; i < datesAndDays.length; i++) {
        //     for (let a = 0; a < attendance.length; a++) {
        //         //console.log(a)
        //         if (datesAndDays[i].formatedDate == attendance[a].attendance_date.toString()) {
        //             datesAndDays[i].attendanceObj = attendance[a];
        //         }
        //     }
        // }
        
        // setmonthCalenderData(datesAndDays);

    }, []);



    useEffect(() => {
        let data = { ...filterdata };
        data.attendance_type = data?.attendance_type != "" ? data?.attendance_type?.value : "time";
        data.branch_id = data?.branch_id != "[]" ? data?.branch_id : "";
        data.hod_id = data?.hod_id != "[]" ? data?.hod_id : "";
        data.designation_id = data?.designation_id != "[]" ? data?.designation_id : "";
        data.client_id = data?.client_id != "[]" ? data?.client_id : "";
        data.department_id = data?.department_id != "[]" ? data?.department_id : "";
        data.searchkey = empData?.emp_id

        if (filterdata != null) {
         // setIsLoading(true)
          postApi("company/get-attendance-data", data, token)
            .then((resp) => {
              console.log(JSON.stringify(resp));
              if (resp?.status == 'success') {
                 setempData(resp?.employees?.docs[0]);

                //   let datesAndDays = HelperFunctions.getAllDatesAndDays(parseInt(props?.route?.params?.filterdata?.search_month), props?.route?.params?.filterdata?.search_year);

                //   let attendance = props?.route?.params?.paramData?.attendance
                //   for (let i = 0; i < datesAndDays.length; i++) {
                //       for (let a = 0; a < attendance.length; a++) {
                //           //console.log(a)
                //           if (datesAndDays[i].formatedDate == attendance[a].attendance_date.toString()) {
                //               datesAndDays[i].attendanceObj = attendance[a];
                //           }
                //       }
                //   }

                //   setmonthCalenderData(datesAndDays);


                // setEmpdata(resp?.employees);
                // setIsLoading(false)
              } else {
                HelperFunctions.showToastMsg(resp.message);
                //setIsLoading(false)
              }
    
            }).catch((err) => {
              console.log(err);
              //setIsLoading(false)
              HelperFunctions.showToastMsg(err.message);
            })
        }

    },[filterdata])

    const _openFilter = () => {
        let pData = {
            "pageno": 1,
            "search_month": { label: HelperFunctions.getMonthName(filterdata?.search_month), value: (filterdata?.search_month).toString() },
            "search_year": { label: (filterdata?.search_year).toString(), value: (filterdata?.search_year).toString() },
            "attendance_type": filterdata?.attendance_type,
            "branchData": props?.route?.params?.paramData?.branchData ? props?.route?.params?.paramData?.branchData : [],
            "designationData": props?.route?.params?.paramData?.designationData ? props?.route?.params?.paramData?.designationData : [],
            "departmentData": props?.route?.params?.paramData?.departmentData ? props?.route?.params?.paramData?.departmentData : [],
            "hodData": props?.route?.params?.paramData?.hodData ? props?.route?.params?.paramData?.hodData : [],
            "clientData": props?.route?.params?.paramData?.clientData ? props?.route?.params?.paramData?.clientData : [],
            "search_day": filterdata?.search_day,
            "searchkey":props?.route?.params?.paramData?.searchkey
          }
      
          console.log("filter data paramData ====> ", pData)
          console.log("filter data paramData ======================= ")
          props.navigation.navigate('FilterEmployeePage', { paramData: pData, from:'attendanceView_page' })
    }


    const ListRender = ({ index, item }) => (
        <View style={{ paddingTop: index == 0 ? 12 : 8, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>

            <View style={{ paddingRight: 0, paddingLeft: 12, paddingRight: 12 }}>
                <View style={{ backgroundColor: colors.white, flex: 1, borderRadius: 4, flexDirection: 'column', justifyContent: 'flex-stat', alignItems: 'center' }}>
                    <Text style={{ letterSpacing: 0.4, color: '#8A8E9C', fontFamily: FontFamily.regular, fontSize: sizes.md + 1 }}>{HelperFunctions.getMonthName(item.month-1)}</Text>
                    <Text style={{ letterSpacing: 0.4, color: '#4E525E', fontFamily: FontFamily.bold, fontSize: sizes.h5, paddingVertical: 2 }}>{item.date ? item.date <= 9 ? 0 : null : null}{item.date}</Text>
                    <Text style={{ letterSpacing: 0.4, color: '#8A8E9C', fontFamily: FontFamily.regular, fontSize: sizes.md + 1 }}>{item.dayName}</Text>
                </View>

            </View>

            <View style={{ flex: 1, paddingRight: 12 }}>
                {item?.attendanceObj ? <>
                    {item?.attendanceObj?.leave_type == 'present' || item?.attendanceObj?.leave_type == 'full_day' ?
                        <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md, paddingLeft:8 }}>{HelperFunctions.getTypeFullName(item?.attendanceObj?.first_half, true)}</Text>
                            </View>
                        </View>
                        :
                        <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', paddingRight: 12 }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.first_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md, paddingLeft:8 }}>{HelperFunctions.getTypeFullName(item?.attendanceObj?.first_half, false)}</Text>
                                <Shift />
                            </View>
                            <View style={{ marginTop: 5, backgroundColor: HelperFunctions.getColorCode(item?.attendanceObj?.second_half).bgColor, width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', paddingRight: 12 }}>
                                <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: HelperFunctions.getColorCode(item?.attendanceObj?.second_half).textColor, fontFamily: FontFamily.medium, fontSize: sizes.md, paddingLeft:8 }}>{HelperFunctions.getTypeFullName(item?.attendanceObj?.second_half, false)}</Text>
                                <Shift />
                            </View>
                        </View>
                    }
                </> :
                    <View style={{ paddingLeft: 12, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View style={{ backgroundColor: '#fff3de', width: '100%', padding: 5, paddingVertical: 20, borderRadius: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Text style={{ letterSpacing: 0.4, marginLeft: 4, color: '#FFAC10', fontFamily: FontFamily.medium, fontSize: sizes.md,lineHeight:16, paddingLeft:8 }}>No Entry Log</Text>
                        </View>
                    </View>
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
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 0 }}>
                        <View style={{ borderWidth: 1, paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E2538' }}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ marginRight: 12 }}>
                                    <Image source={{uri:'https://uaedemo.hrmlix.com/assets/images/user.jpg'}} style={{ height: 35, width: 35, borderRadius: 50, objectFit: 'cover' }} />
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
                                        <Text style={{ marginLeft: 4, fontFamily: FontFamily.medium, color: '#C8C8C8', fontSize: sizes.md, textTransform: 'uppercase' }}>{HelperFunctions.getMonthName(filterdata?.search_month)}, {filterdata?.search_year}</Text>
                                    </View>
                                </View>

                            </View>
                            <TouchableOpacity onPress={() => { _openFilter() }} style={{ padding: 6, paddingHorizontal: 10 }}>
                                <Filter color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingHorizontal: 14}}>

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={monthCalenderData}
                                renderItem={ListRender}
                                contentContainerStyle={{ marginBottom: 30 }}
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