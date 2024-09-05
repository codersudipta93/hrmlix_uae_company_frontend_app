
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    StatusBar,
    Image,
    Animated,
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
} from '../../constants/Theme';

import { LOCAL_IMAGES, LOCAL_ICONS, AllSourcePath } from '../../constants/PathConfig';
import { HelperFunctions } from '../../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getData, setData, deleteData } from '../../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../../component/Header';

import { postApi } from '../../Service/service';
import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../../assets/icons/Delete';
import Filter from '../../assets/icons/Filter';
import BootomSheet from '../../component/BootomSheet';
import CustomButton from '../../component/CustomButton';
import FloatingTimePicker from '../../component/FloatingTimePicker';
import Loader from '../../component/Loader';
import NoDataFound from '../../component/NoDataFound';
import Employees from '../TabScreens/Employees';

const ConsumptionHistory = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails, token } = useSelector(state => state.project);

    const { t, i18n } = useTranslation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);

    const [startdate, setStartdate] = useState("");
    const [enddate, setEnddate] = useState("");
    const [consumptionHistory, setConsumptionHistory] = useState("");
    const [selectedconsumptionHistory, setSelectedconsumptionHistory] = useState("");

    const [loadingView, setloadingView] = useState(false);
    const [isBtnLoading, setBtnLoading] = useState(false);

    // Animation state
    const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            let formatedDate = (new Date()).toISOString().split('T')[0];

            setStartdate(formatedDate);
            setEnddate(HelperFunctions.getLastDateOfCurrentMonth());
            getconsumptionHistoryList(HelperFunctions.getmonthYear(formatedDate).month - 1, HelperFunctions.getmonthYear(formatedDate).year, HelperFunctions.getmonthYear(HelperFunctions.getLastDateOfCurrentMonth()).month - 1, HelperFunctions.getmonthYear(HelperFunctions.getLastDateOfCurrentMonth()).year)
            console.log("get date")
            console.log(HelperFunctions.getmonthYear(formatedDate).month - 1)
            console.log(HelperFunctions.getmonthYear(HelperFunctions.getLastDateOfCurrentMonth()).month - 1)
        }
    }, [isFocused]);

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


    const getconsumptionHistoryList = (fromM, fromY, toM, toY) => {
        setloadingView(true)
        let paramData = {
            "pageno": 1,
            "wage_month_from": fromM,
            "wage_year_from": fromY,
            "wage_month_to": toM,
            "wage_year_to": toY,
            "corporate_id": userDetails?.corporate_id,
            "row_checked_all": false,
            "unchecked_row_ids": [],
            "checked_row_ids": []
        }
        postApi("company/get-company-credit-usage-details-list", paramData, token)
            .then((resp) => {
               
                if (resp?.status == 'success') {
                    setConsumptionHistory(resp?.company[0]?.company_credit_history_logs ? resp?.company[0]?.company_credit_history_logs : "");
                    setloadingView(false)
                    //HelperFunctions.showToastMsg(resp.message);
                } else if (resp?.status == 'val_err') {
                    let message = ""
                    for (const key in resp.val_msg) {
                        if (resp.val_msg[key].message) {
                            message = resp.val_msg[key].message;
                            break;
                        }
                    }
                    HelperFunctions.showToastMsg(message);
                    setloadingView(false)
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setloadingView(false)
                }

            }).catch((err) => {
                console.log(err);
                setloadingView(false);
                HelperFunctions.showToastMsg(err.message);
            })
    }

    const toggleModal = () => {
        if (isModalVisible) {
            // Hide modal
            Animated.timing(animValue, {
                toValue: 1000,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setModalVisible(false));
        } else {
            // Show modal
            setModalVisible(true);
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };


    const toggleFilter = () => {
        if (isFilterModalVisible) {
            // Hide modal
            Animated.timing(animValue, {
                toValue: 1000,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setFilterModalVisible(false));
        } else {
            // Show modal
            setFilterModalVisible(true);
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const ApplyFilter = () => {
        console.log("selected date")
        console.log(startdate)
        console.log(enddate)
        let paramData = {
            "pageno": 1,
            "wage_month_from": HelperFunctions.getmonthYear(startdate).month - 1,
            "wage_year_from": HelperFunctions.getmonthYear(startdate).year,
            "wage_month_to": HelperFunctions.getmonthYear(enddate).month - 1,
            "wage_year_to": HelperFunctions.getmonthYear(enddate).year,
            "corporate_id": userDetails?.corporate_id,
            "row_checked_all": false,
            "unchecked_row_ids": [],
            "checked_row_ids": []
        }
        postApi("company/get-company-credit-usage-details-list", paramData, token)
            .then((resp) => {
                console.log(resp);
                if (resp?.status == 'success') {
                    setConsumptionHistory(resp?.company[0]?.company_credit_history_logs ? resp?.company[0]?.company_credit_history_logs : "");
                    HelperFunctions.showToastMsg(resp.message);
                    setBtnLoading(false)
                    toggleFilter();

                } else if (resp?.status == 'val_err') {
                    let message = ""
                    for (const key in resp.val_msg) {
                        if (resp.val_msg[key].message) {
                            message = resp.val_msg[key].message;
                            break;
                        }
                    }
                    HelperFunctions.showToastMsg(message);
                    setBtnLoading(false)
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setBtnLoading(false)
                }

            }).catch((err) => {
                console.log(err);
                setBtnLoading(false)
                HelperFunctions.showToastMsg(err.message);
            })
    }

    const ListRender = ({ index, item }) => (
        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: consumptionHistory.length - 1 == index ? 8 : 0, borderBottomRightRadius: consumptionHistory.length - 1 == index ? 8 : 0 }]}>

            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 12 }}>
                    <>
                        <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Invoice Id/Cred.</Text>
                        <Text onPress={() => {
                            if(item?.type == "consumed"){
                                toggleModal()
                                setSelectedconsumptionHistory(item)
                            }else{
                                HelperFunctions.showToastMsg("No Consumed Data Found",)
                            }
                           
                        }} style={{ fontFamily: FontFamily.medium, color: '#60B057', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{item?.type != "consumed" ? item?.details?.inv_id : (HelperFunctions.getMonthName(item?.details?.wage_month) + ', ' + item?.details?.wage_year)}</Text>
                    </>
                    <>
                        <Text style={{ marginTop: 8, fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Particulars</Text>
                        <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6, textTransform: 'capitalize' }}>{HelperFunctions.getparticularName(item?.type)}</Text>
                    </>
                    <>
                        <Text style={{ marginTop: 8, fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Addition</Text>
                        <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{item?.type != "consumed" ? item?.details?.credit_amount ? parseFloat((item?.details?.credit_amount)).toFixed(2) : "--" : "--"}</Text>
                    </>


                </View>
            </View>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 12 }}>
                    <>
                        <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Date</Text>
                        <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{HelperFunctions.getDateDDMMYY(item?.created_at)}</Text>
                    </>
                    <>
                        <Text style={{ marginTop: 8, fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Deduction</Text>
                        <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{item?.type == "consumed" ? item?.details?.total_cost ? parseFloat((item?.details?.total_cost)).toLocaleString('en-US') : "---" : "--"} </Text>
                    </>

                    <>
                        <Text style={{ marginTop: 8, fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Balance</Text>
                        <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{item?.credit_balance ? parseFloat((item?.credit_balance)).toLocaleString('en-US') : "--"}</Text>
                    </>

                </View>
            </View>

        </View >
    );

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Consumption History')}
                    buttonTextStyle={{ lineHeight: 21 }}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                    customIcon={true}
                    children={<Filter />}
                    onPressCustomIcon={() => { toggleFilter() }}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
                        {consumptionHistory != "" ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={consumptionHistory}
                                renderItem={ListRender}
                                contentContainerStyle={{ marginBottom: 30 }}
                            />
                            :

                            <NoDataFound />
                        }
                    </View>
                </ScrollView>

                <BootomSheet
                    toggleModal={toggleModal}
                    isModalVisible={isModalVisible}
                    animValue={animValue}
                    modalContainerStyle={{
                        backgroundColor: 'white',
                        //padding: 20,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <View>
                        <View style={{
                            backgroundColor: '#1E2538', paddingVertical: 15, paddingHorizontal: 12, borderTopLeftRadius: 10,
                            borderTopRightRadius: 10, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <Text style={[styles.modalheadingText, { color: '#fff' }]}>Comsumption History</Text>
                            <IonIcon
                                name="close"
                                size={20}
                                color="#fff"
                            />
                        </View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <>
                                <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                    <View><Text style={styles.rightText}>Plan Name - {selectedconsumptionHistory?.details?.plan?.plan_name ? selectedconsumptionHistory?.details?.plan?.plan_name : "N/A"}</Text></View>
                                    <View><Text style={styles.rightText}>Credit - {selectedconsumptionHistory?.details?.credit_balance}</Text></View>
                                </View>
                                <>

                                    <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1, }}>
                                        <View style={{ paddingVertical: 6, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.rightText, { marginBottom: 0, textAlign: 'left' }]}>Plan Rental</Text></View>
                                        <View style={{ paddingVertical: 6, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.rightText, { marginBottom: 0, textAlign: 'center' }]}>No of Emp</Text></View>
                                        <View style={{ paddingVertical: 6, width: "25%", borderRightColor: '#E7EAF1' }}><Text style={[styles.rightText, { marginBottom: 0, textAlign: 'center' }]}>Credit used</Text></View>
                                    </View>

                                    <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1, borderTopWidth: 0 }}>
                                        <View style={{ paddingVertical: 10, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'left' }]}>Free Employees</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_free_employee}</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 2, textAlign: 'center' }]}>--</Text></View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1, borderTopWidth: 0 }}>
                                        <View style={{ paddingVertical: 10, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'left' }]}>Free Sub Admin</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_free_staff}</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 2, textAlign: 'center' }]}>--</Text></View>
                                    </View>
                                </>

                                <>

                                    <View style={{ marginTop: 12, flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1 }}>
                                        <View style={{ paddingVertical: 10, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'left' }]}>Additional Employees</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_additional_employee}</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 2, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_employee_cost}</Text></View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1, borderTopWidth: 0 }}>
                                        <View style={{ paddingVertical: 10, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'left' }]}>Additional SubAdmin</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_additional_staff}</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 2, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_staff_cost}</Text></View>
                                    </View>
                                </>

                                <>

                                    <View style={{ marginTop: 12, flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1 }}>
                                        <View style={{ paddingVertical: 10, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'left' }]}>Salary Temp Cost</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'center' }]}> </Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 2, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_salary_temp_cost}</Text></View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1, borderTopWidth: 0 }}>
                                        <View style={{ paddingVertical: 10, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'left' }]}>Salary Head Cost</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'center' }]}> </Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 2, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_salary_head_cost}</Text></View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1, borderTopWidth: 0 }}>
                                        <View style={{ paddingVertical: 10, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'left' }]}>Monthly Rental Cost</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'center' }]}> </Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", }}><Text style={[styles.leftText, { marginBottom: 0, fontSize: sizes.h6 - 2, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_monthly_rental_cost}</Text></View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', borderColor: '#E7EAF1', borderWidth: 1, borderTopWidth: 0 }}>
                                        <View style={{ paddingVertical: 10, width: "50%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.rightText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'left' }]}>Total Cost</Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", borderRightWidth: 1, borderRightColor: '#E7EAF1' }}><Text style={[styles.rightText, { marginBottom: 0, fontSize: sizes.h6 - 1, textAlign: 'center' }]}> </Text></View>
                                        <View style={{ paddingVertical: 10, width: "25%", }}><Text style={[styles.rightText, { marginBottom: 0, fontSize: sizes.h6 - 2, textAlign: 'center' }]}>{selectedconsumptionHistory?.details?.total_cost}</Text></View>
                                    </View>
                                </>
                            </>


                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                                <CustomButton
                                    style={{ width: '20%', height: 40, backgroundColor: colors.primary }}
                                    buttonText="OK"
                                    onPress={() => { toggleModal() }}
                                />
                            </View>
                        </View>
                    </View>
                </BootomSheet>



                <BootomSheet
                    toggleModal={toggleFilter}
                    isModalVisible={isFilterModalVisible}
                    animValue={animValue}
                    modalContainerStyle={{
                        backgroundColor: 'white',
                        //padding: 20,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <View>
                        <View style={{
                            backgroundColor: '#E7EAF1', paddingVertical: 15, paddingHorizontal: 12, borderTopLeftRadius: 10,
                            borderTopRightRadius: 10, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <Text style={styles.modalheadingText}>Filter</Text>
                            <IonIcon
                                name="close"
                                size={20}
                                color="#0E1F33"
                            />
                        </View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ marginBottom: 8, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                <FloatingTimePicker
                                    pickerType="date"
                                    pickerIconStyle={{ height: 20, width: 20, tintColor: '#60B057' }}
                                    pickerIcon={LOCAL_ICONS.calender}
                                    editableStatus={true}
                                    labelName={'From Date'}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                    selectedValue={startdate}
                                    inputMargin={20}
                                    confirmDateClick={(timestamp) => {
                                        let formatedDate = (timestamp).toISOString().split('T')[0];
                                        setStartdate(formatedDate)
                                    }}
                                />
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                <FloatingTimePicker
                                    pickerType="date"
                                    pickerIconStyle={{ height: 20, width: 20, tintColor: '#60B057' }}
                                    pickerIcon={LOCAL_ICONS.calender}
                                    editableStatus={true}
                                    labelName={'To Date'}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                    selectedValue={enddate}
                                    inputMargin={20}
                                    confirmDateClick={(timestamp) => {
                                        let formatedDate = (timestamp).toISOString().split('T')[0];
                                        setEnddate(formatedDate)
                                    }}
                                />
                            </View>


                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20, flexDirection: 'row' }}>
                                <CustomButton
                                    style={{ width: '40%', height: 40, backgroundColor: "#F5F7FB", borderWidth: 1, borderColor: colors.primary }}
                                    buttonTextStyle={{ color: colors.primary }}
                                    buttonText="Cancel"
                                    onPress={() => { toggleFilter() }}
                                />
                                <CustomButton
                                    isLoading={isBtnLoading}
                                    style={{ width: '40%', height: 40, backgroundColor: colors.primary, marginLeft: 18 }}
                                    buttonText="Apply"
                                    onPress={() => {
                                        setBtnLoading(true)
                                        ApplyFilter()

                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </BootomSheet>
            </View>
            <Loader isLoading={loadingView} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#F5F7FB'
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
    modalheadingText: {
        fontSize: sizes.h6,
        fontFamily: FontFamily.semibold,
        color: '#0E1F33'
    },
    leftText: {
        fontSize: sizes.h6 - 2,
        marginBottom: 10,
        fontFamily: FontFamily.regular,
        color: '#868F9A'
    },
    rightText: {
        fontSize: sizes.h6 - 1,
        marginBottom: 10,
        fontFamily: FontFamily.medium,
        color: '#1E2538'
    },

});
export default ConsumptionHistory;