
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
    ScrollView,
    Platform
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
import Attendance from './TabScreens/Attendance';

const EditMonthlyAttendanceDetails = props => {

    const dispatch = useDispatch();
    const { userDetails,companyData, token } = useSelector(state => state.project);
    const isFocused = useIsFocused();
    const route = useRoute();

    const { t, i18n } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);


    const [paydays, setPaydays] = useState("");
    const [totalAbsent, setTotalAbsent] = useState("");
    const [totalAttendance, setTotalAttendance] = useState("");
    const [totalCL, setCL] = useState("");
    const [totalGL, setGL] = useState("");
    const [totalHL, setHL] = useState("");
    const [totalKB, setKB] = useState("");
    const [totalLOP, setLOP] = useState("");
    const [totalML, setML] = useState("");
    const [totalPL, setPL] = useState("");
    const [totalOvertime, setOvertime] = useState("");
    const [adjustDays, setAdjustDays] = useState("");
    const [totalLate, setTotalLate] = useState("");
    const [weekOff, setWeekOff] = useState("");


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
            console.log(props?.route?.params);
            setData(props?.route?.params?.pdata);
            if (props?.route?.params?.attendanceData) {
                let attendanceData = props?.route?.params?.attendanceData;
                setPaydays(attendanceData.paydays);
                setTotalAbsent(attendanceData.total_absent);
                setTotalAttendance(attendanceData.total_attendance);
                setCL(attendanceData.total_cl);
                setGL(attendanceData.total_gl);
                setHL(attendanceData.total_hl);
                setKB(attendanceData.total_kb);
                setLOP(attendanceData.total_lop);
                setML(attendanceData.total_ml);
                setAdjustDays(attendanceData.adjust_day);
                setTotalLate(attendanceData.total_late);
                setWeekOff(attendanceData.total_wo);
                setOvertime(attendanceData.total_overtime);
                setPL(attendanceData.total_pl)
            }
        }
    }, []);


  


    const validateForm = () => {
        // Simple validation for non-empty and numeric values
        const fields = [
            { value: paydays, name: 'Pay Days' },
            { value: totalAbsent, name: 'Total Absent' },
            { value: totalAttendance, name: 'Total Attendance' },
            { value: totalCL, name: 'CL' },
            { value: totalGL, name: 'GL' },
            { value: totalHL, name: 'HL' },
            { value: totalKB, name: 'KB' },
            { value: totalLOP, name: 'LOP' },
            { value: totalML, name: 'ML' },
            { value: totalOvertime, name: 'total Overtime' },
            { value: totalPL, name: 'PL' },
            { value: adjustDays, name: 'Adjust Days' },
            { value: totalLate, name: 'Total Late' },
            { value: weekOff, name: 'Week Off' },
        ];

        for (const field of fields) {
            if (isNaN(parseFloat(field.value))) {
                HelperFunctions.showToastMsg(`${field.name} must be a non-empty numeric value.`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
           
            
            
            setIsLoading(true);
            let param = {
                "attendance_month": props?.route?.params?.filterdata?.search_month?.value,
                "attendance_year": props?.route?.params?.filterdata?.search_year?.value,
                "register_type": "monthly",
                "emp_id":  props?.route?.params?.empData?.emp_id,
                "monthly_attendance": JSON.stringify({
                    paydays: paydays ? paydays : "",
                    total_absent: totalAbsent ? totalAbsent : "",
                    total_attendance: totalAttendance ? totalAttendance : "",
                    total_cl: totalCL,
                    total_gl: totalGL,
                    total_hl: totalHL,
                    total_kb: totalKB,
                    total_lop: totalLOP,
                    total_ml: totalML,
                    total_overtime: totalOvertime,
                    total_pl: totalPL,
                    adjust_day: adjustDays,
                    total_late: totalLate,
                    total_wo: weekOff
                })
            }

            postApi("company/update-attendance-data", param, token)
                .then((resp) => {
                    console.log(resp)
                    if (resp?.status == 'success') {
                        setIsLoading(false);
                        HelperFunctions.showToastMsg(resp.message);
                        props.navigation.goBack()
                    } else {
                       HelperFunctions.showToastMsg(resp.message);
                        setIsLoading(false)
                    }
                }).catch((err) => {
                   // console.log(err);
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
                                <Image source={{ uri: props?.route?.params?.empData?.profile_pic != null && props?.route?.params?.empData?.profile_pic != "null" ? props?.route?.params?.empData?.profile_pic : 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: 35, width: 35, borderRadius: 50, objectFit: 'cover' }} />
                            </View>
                            <View>
                                <Text style={{ fontFamily: FontFamily.semibold, color: colors.white, fontSize: sizes.h6 }}>{props?.route?.params?.empData?.emp_first_name} {props?.route?.params?.empData?.emp_last_name}</Text>
                                <Text style={{ fontFamily: FontFamily.regular, color: '#C8C8C8', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>ID: {props?.route?.params?.empData?.emp_id}</Text>
                                <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Image
                                        style={{
                                            height: 14,
                                            width: 14,
                                            tintColor: '#C8C8C8',
                                        }}
                                        source={LOCAL_ICONS.calender}
                                    />
                                    <Text style={{ marginLeft: 4, fontFamily: FontFamily.medium, color: '#C8C8C8', fontSize: sizes.md, textTransform: 'uppercase' }}>{HelperFunctions.getMonthName(props?.route?.params?.filterdata?.search_month?.value - 1)}, {props?.route?.params?.filterdata?.search_year?.value}</Text>
                                </View>
                            </View>

                        </View>

                    </View>
                    <View style={{ paddingHorizontal: 16, marginTop: 25, }}>

                        <FloatingLabelInput
                            label="Pay Days"
                            placeholder="Total Pay Days"
                            value={paydays.toString()}
                            onChangeText={setPaydays}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={paydays !== "" ? "#60B057" : "#CACDD4"}
                            top={0}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
                        />
                        {/* Total Absent */}
                        <FloatingLabelInput
                            label="Total Absent"
                            placeholder="Total Absent Days"
                            value={totalAbsent.toString()}
                            onChangeText={setTotalAbsent}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalAbsent !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}

                        />
                        {/* Total Attendance */}
                        <FloatingLabelInput
                            label="Total Attendance"
                            placeholder="Total Attendance Days"
                            value={totalAttendance.toString()}
                            onChangeText={setTotalAttendance}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalAttendance !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}

                        />
                        {/* CL */}
                        <FloatingLabelInput
                            label="CL"
                            placeholder="Total CL"
                            value={totalCL.toString()}
                            onChangeText={setCL}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalCL !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}

                        />
                        {/* GL */}
                        <FloatingLabelInput
                            label="GL"
                            placeholder="Total GL"
                            value={totalGL.toString()}
                            onChangeText={setGL}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalGL !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}

                        />

                        {/* New input fields */}

                        {/* HL */}
                        <FloatingLabelInput
                            label="HL"
                            placeholder="Total HL"
                            value={totalHL.toString()}
                            onChangeText={setHL}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalHL !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}

                        />
                        {/* KB */}
                        <FloatingLabelInput
                            label="KB"
                            placeholder="Total KB"
                            value={totalKB.toString()}
                            onChangeText={setKB}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalKB !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}

                        />
                        {/* LOP */}
                        <FloatingLabelInput
                            label="LOP"
                            placeholder="Total LOP"
                            value={totalLOP.toString()}
                            onChangeText={setLOP}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalLOP !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                        />
                        {/* ML */}
                        <FloatingLabelInput
                            label="ML"
                            placeholder="Total ML"
                            value={totalML.toString()}
                            onChangeText={setML}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalML !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}

                        />
                        {/* Overtime */}
                        <FloatingLabelInput
                            label="Overtime"
                            placeholder="Total Overtime"
                            value={totalOvertime.toString()}
                            onChangeText={setOvertime}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalOvertime !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
                        />
                        {/* PL */}
                        <FloatingLabelInput
                            label="PL"
                            placeholder="Total PL"
                            value={totalPL.toString()}
                            onChangeText={setPL}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalPL !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
                        />
                        {/* Adjust Days */}
                        <FloatingLabelInput
                            label="Adjust Days"
                            placeholder="Total Adjust Days"
                            value={adjustDays.toString()}
                            onChangeText={setAdjustDays}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={adjustDays !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
                        />
                        {/* Total Late */}
                        <FloatingLabelInput
                            label="Total Late"
                            placeholder="Total Late"
                            value={totalLate.toString()}
                            onChangeText={setTotalLate}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={totalLate !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
                        />
                        {/* Week Off */}
                        <FloatingLabelInput
                            label="Week Off"
                            placeholder="Total Week Off"
                            value={weekOff.toString()}
                            onChangeText={setWeekOff}
                            labelColor="#6F7880"
                            labelBg="#fff"
                            inputColor="#5A5B5B"
                            placeholderColor="#8A8E9C"
                            inputContainerColor={weekOff !== "" ? "#60B057" : "#CACDD4"}
                            top={10}
                            marginBottom={4}
                            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
                        />

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
                                    handleSubmit()
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
export default EditMonthlyAttendanceDetails;